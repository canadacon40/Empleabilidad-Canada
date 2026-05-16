import { AgentName, AGENT_DEFINITIONS } from './types';
import { AIProvider } from './provider';
import { INTAKE_PARSER_PROMPT, POSITIONING_STRATEGIST_PROMPT } from './prompts';
import prisma from '@/lib/db';
import { ScoringEngine, ScoreCategory } from '../scoring/engine';

export class AIOrchestrator {
  private diagnosticQueue: AgentName[] = [
    'IntakeParser',
    'PositioningStrategist'
  ];

  async executeDiagnostic(leadId: string) {
    console.log(`🚀 Starting AI Diagnostic for Lead: ${leadId}`);
    
    await this.generateModule(leadId, 'IntakeParser');
    await this.generateModule(leadId, 'PositioningStrategist');

    // 5. Update Lead Status
    await prisma.lead.update({
      where: { id: leadId },
      data: { status: 'DIAGNOSIS_GENERATED' }
    });

    return { status: 'DIAGNOSIS_GENERATED' };
  }

  async generateModule(leadId: string, agentName: AgentName) {
    console.log(`🛠️ Generating Module: ${agentName} for Lead: ${leadId}`);
    
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { 
        intake: true,
        modules: true 
      }
    });

    if (!lead) throw new Error("Lead not found");

    // 1. Gather Dependencies
    const definition = AGENT_DEFINITIONS[agentName];
    const prevModules = lead.modules.reduce((acc: any, m) => {
      acc[m.agentName] = m.content;
      return acc;
    }, {});

    const dependenciesMet = definition.dependencies.every(dep => !!prevModules[dep]);
    if (!dependenciesMet) {
      throw new Error(`Missing dependencies for ${agentName}: ${definition.dependencies.filter(d => !prevModules[d]).join(', ')}`);
    }

    // 2. Map Inputs & Select Prompt
    const { STYLE_MANIFESTO } = require('./quality/manifesto');
    const { QualityValidator } = require('./quality/validator');

    let systemPrompt: string;
    
    // Map AgentName to specific Module Prompts if available
    const moduleMap: Record<string, string> = {
      'IntakeParser': 'INTAKE_PARSER_PROMPT',
      'PositioningStrategist': 'POSITIONING_STRATEGIST_PROMPT',
      'ResumeStrategist': 'RESUME_STRATEGY',
      'LinkedInBranding': 'LINKEDIN_BRANDING',
      'VisibilityStrategy': 'MARKET_REPOSITIONING'
    };

    const { MODULE_SYSTEM_PROMPTS } = require('./modules/prompts');
    const specificPromptKey = moduleMap[agentName];
    systemPrompt = `${STYLE_MANIFESTO}\n\n${MODULE_SYSTEM_PROMPTS[specificPromptKey] || (agentName === 'IntakeParser' ? INTAKE_PARSER_PROMPT : POSITIONING_STRATEGIST_PROMPT)}`;
    
    const input = JSON.stringify({
      lead: { id: lead.id, cv: lead.cvText, intake: lead.intake?.rawTallyData },
      context: prevModules
    });

    // 3. Execute LLM
    const startTime = Date.now();
    const output = await AIProvider.generateJSON(input, systemPrompt);
    const durationMs = Date.now() - startTime;
    const estimatedTokens = (input.length + JSON.stringify(output).length) / 4; // Basic heuristic

    // 4. Quality Audit Layer (Phase 3E)
    console.log(`🔍 Auditing Quality for ${agentName}...`);
    const qualityAudit = await QualityValidator.validate(output, agentName);
    
    // 5. Build Enriched Metadata
    const enrichedOutput = {
      ...(output as any),
      _qualityAudit: qualityAudit,
      _opsMetadata: {
        durationMs,
        tokensTotal: estimatedTokens,
        logDate: new Date().toISOString()
      }
    };

    // 6. Special Handling: Scoring Engine Integration
    if (agentName === 'PositioningStrategist' && enrichedOutput.scoring) {
      await this.saveScores(leadId, enrichedOutput.scoring, enrichedOutput.scoreJustifications || {});
    }

    // 7. Persist Module
    const module = await prisma.aIModule.upsert({
      where: { 
        leadId_agentName: { 
          leadId, 
          agentName 
        } 
      },
      update: {
        content: enrichedOutput as any,
        status: qualityAudit.flags.length > 0 ? 'NEEDS_REVIEW' : 'GENERATED',
        version: { increment: 1 },
        updatedAt: new Date()
      },
      create: {
        leadId,
        agentName,
        content: enrichedOutput as any,
        status: qualityAudit.flags.length > 0 ? 'NEEDS_REVIEW' : 'GENERATED',
        version: 1
      }
    });

    return module;
  }

  private async saveScores(leadId: string, scores: Record<string, number>, justifications: Record<string, string>) {
    for (const [category, value] of Object.entries(scores)) {
      await prisma.employabilityScore.upsert({
        where: { 
          leadId_category: { 
            leadId, 
            category 
          } 
        },
        update: {
          value,
          justification: justifications[category] || ScoringEngine.getJustification(category as ScoreCategory, value),
        },
        create: {
          leadId,
          category,
          value,
          justification: justifications[category] || ScoringEngine.getJustification(category as ScoreCategory, value),
        }
      });
    }
  }
}
