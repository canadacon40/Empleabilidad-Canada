import prisma from "@/lib/db";

export interface OpsMetric {
  leadId: string;
  agentName: string;
  durationMs: number;
  tokensTotal: number;
  status: string;
  qualityScore: number;
  hasHallucinations: boolean;
}

export class OpsTracker {
  static async logGeneration(metric: OpsMetric) {
    console.log(`📊 Ops Logging: ${metric.agentName} | ${metric.durationMs}ms | ${metric.tokensTotal} tokens`);
    
    // For Phase 3G, we'll store this in a simplified way within the AIModule content
    // In a production system, this would be a separate OpsAnalytics table.
    
    const module = await prisma.aIModule.findUnique({
      where: { leadId_agentName: { leadId: metric.leadId, agentName: metric.agentName } }
    });

    if (module) {
      const existingContent = module.content as any;
      await prisma.aIModule.update({
        where: { id: module.id },
        data: {
          content: {
            ...existingContent,
            _opsMetadata: {
              durationMs: metric.durationMs,
              tokensTotal: metric.tokensTotal,
              logDate: new Date().toISOString()
            }
          }
        }
      });
    }
  }

  static async getSummary() {
    const modules = await prisma.aIModule.findMany();
    
    const stats = modules.reduce((acc: any, m) => {
      const meta = (m.content as any)?._opsMetadata;
      const audit = (m.content as any)?._qualityAudit;
      
      if (meta) {
        acc.totalDuration += meta.durationMs || 0;
        acc.totalTokens += meta.tokensTotal || 0;
        acc.count++;
      }
      
      if (audit) {
        acc.avgQuality += (audit.scores.realism + audit.scores.specificity + audit.scores.genericness + audit.scores.depth) / 4;
        if (audit.flags.length > 0) acc.hallucinationCount++;
      }

      if (m.status === 'REJECTED') acc.rejectionCount++;
      if (m.version > 1) acc.regenerationCount += (m.version - 1);

      return acc;
    }, { 
      totalDuration: 0, 
      totalTokens: 0, 
      count: 0, 
      avgQuality: 0, 
      hallucinationCount: 0, 
      rejectionCount: 0,
      regenerationCount: 0
    });

    return {
      avgTime: stats.count ? stats.totalDuration / stats.count : 0,
      avgCost: stats.count ? stats.totalTokens / stats.count : 0,
      avgQuality: stats.count ? stats.avgQuality / stats.count : 0,
      rejectionRate: stats.count ? (stats.rejectionCount / stats.count) * 100 : 0,
      regenerationRate: stats.count ? (stats.regenerationCount / stats.count) * 100 : 0,
      hallucinationRate: stats.count ? (stats.hallucinationCount / stats.count) * 100 : 0,
      totalProcessed: stats.count
    };
  }
}
