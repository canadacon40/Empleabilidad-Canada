import { AIProvider } from '../provider';
import { QUALITY_SCORE_PROMPT, STYLE_MANIFESTO } from './manifesto';

export interface QualityResult {
  scores: {
    realism: number;
    specificity: number;
    genericness: number;
    depth: number;
  };
  flags: string[];
  summary: string;
}

export class QualityValidator {
  static async validate(content: any, agentName: string): Promise<QualityResult> {
    const prompt = `
      Module: ${agentName}
      Content: ${JSON.stringify(content)}
      
      ${STYLE_MANIFESTO}
      
      Task: Perform a quality audit of the above content.
    `;

    try {
      return await AIProvider.generateJSON<QualityResult>(prompt, QUALITY_SCORE_PROMPT);
    } catch (error) {
      console.error("Quality Validation Error:", error);
      return {
        scores: { realism: 0, specificity: 0, genericness: 0, depth: 0 },
        flags: ["VALIDATION_FAILED"],
        summary: "Automatic quality audit could not be completed."
      };
    }
  }

  static checkConsistency(modules: any[]) {
    const flags: string[] = [];
    
    // Example logic: Check if Module 2 (Resume) target NOC matches Module 1 (Positioning)
    const positioning = modules.find(m => m.agentName === 'VisibilityStrategy')?.content;
    const resume = modules.find(m => m.agentName === 'ResumeStrategist')?.content;

    if (positioning && resume) {
      if (positioning.targetNoc !== resume.targetNoc && resume.targetNoc) {
        flags.push("STRATEGIC_MISALIGNMENT: Resume target NOC differs from Positioning strategy.");
      }
    }

    return flags;
  }
}
