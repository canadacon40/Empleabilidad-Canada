export type AgentName = 
  | 'IntakeParser'
  | 'PositioningStrategist'
  | 'ResumeStrategist'
  | 'LinkedInBranding'
  | 'VisibilityStrategy'
  | 'NetworkingStrategy'
  | 'InterviewStrategy'
  | 'ExecutionPsychology'
  | 'PlaybookDecision';

export interface AIAgentDefinition {
  name: AgentName;
  purpose: string;
  inputs: string[];
  outputs: string[];
  dependencies: AgentName[];
}

export interface AIAgentResult {
  agentName: AgentName;
  content: any;
  metadata: {
    model: string;
    tokensUsed: number;
    latency: number;
    timestamp: string;
  };
}

export const AGENT_DEFINITIONS: Record<AgentName, AIAgentDefinition> = {
  IntakeParser: {
    name: 'IntakeParser',
    purpose: 'Extracts and structures raw data from Tally forms, resumes, and LinkedIn profiles.',
    inputs: ['rawTallyData', 'resumeText', 'linkedinHtml'],
    outputs: ['structuredCandidateProfile', 'initialGaps'],
    dependencies: [],
  },
  PositioningStrategist: {
    name: 'PositioningStrategist',
    purpose: 'Defines the candidates unique value proposition and market positioning.',
    inputs: ['structuredCandidateProfile'],
    outputs: ['valueProposition', 'targetMarkets', 'differentiationStrategy'],
    dependencies: ['IntakeParser'],
  },
  ResumeStrategist: {
    name: 'ResumeStrategist',
    purpose: 'Architects the resume logic and ATS optimization strategy.',
    inputs: ['structuredCandidateProfile', 'valueProposition'],
    outputs: ['resumeBlueprint', 'atsKeywords', 'bulletPointStrategy'],
    dependencies: ['PositioningStrategist'],
  },
  LinkedInBranding: {
    name: 'LinkedInBranding',
    purpose: 'Optimizes executive presence and digital branding.',
    inputs: ['valueProposition', 'resumeBlueprint'],
    outputs: ['headline', 'aboutSection', 'experienceOptimization', 'contentStrategy'],
    dependencies: ['ResumeStrategist'],
  },
  VisibilityStrategy: {
    name: 'VisibilityStrategy',
    purpose: 'Architects how the candidate becomes visible to headhunters and decision makers.',
    inputs: ['targetMarkets', 'valueProposition'],
    outputs: ['headhunterList', 'platformStrategy', 'seoKeywords'],
    dependencies: ['PositioningStrategist'],
  },
  NetworkingStrategy: {
    name: 'NetworkingStrategy',
    purpose: 'Designs outreach templates and high-conversion networking workflows.',
    inputs: ['targetMarkets', 'valueProposition'],
    outputs: ['outreachTemplates', 'followUpSequence', 'networkingScripts'],
    dependencies: ['PositioningStrategist'],
  },
  InterviewStrategy: {
    name: 'InterviewStrategy',
    purpose: 'Prepares the candidate for high-stakes executive interviews.',
    inputs: ['valueProposition', 'resumeBlueprint'],
    outputs: ['storytellingFramework', 'objectionHandling', 'qaBank'],
    dependencies: ['ResumeStrategist'],
  },
  ExecutionPsychology: {
    name: 'ExecutionPsychology',
    purpose: 'Manages mindset, burnout prevention, and consistent execution.',
    inputs: ['structuredCandidateProfile', 'behavioralData'],
    outputs: ['mindsetPlan', 'burnoutProtocol', 'executionFramework'],
    dependencies: ['IntakeParser'],
  },
  PlaybookDecision: {
    name: 'PlaybookDecision',
    purpose: 'Orchestrates the final roadmap and decides which modules are priority.',
    inputs: ['allGeneratedModules', 'initialGaps'],
    outputs: ['prioritizedRoadmap', 'criticalActions', 'timeline'],
    dependencies: ['IntakeParser', 'PositioningStrategist', 'ResumeStrategist', 'LinkedInBranding', 'VisibilityStrategy', 'NetworkingStrategy', 'InterviewStrategy', 'ExecutionPsychology'],
  },
};
