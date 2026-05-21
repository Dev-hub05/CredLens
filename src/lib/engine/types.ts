export type PrimaryUseCase = "coding" | "writing" | "data" | "research" | "mixed";

export interface ToolInput {
  toolId: string;
  planId: string;
  seats: number;
  monthlySpend: number;
}

export interface AuditInput {
  teamSize: number;
  useCase: PrimaryUseCase;
  tools: ToolInput[];
}

export interface Recommendation {
  toolId: string;
  toolName: string;
  currentPlanName: string;
  recommendedPlanName: string;
  action: "keep" | "downgrade" | "upgrade" | "replace" | "consolidate";
  reason: string;
  currentMonthlyCost: number;
  optimizedMonthlyCost: number;
  monthlySavings: number;
  confidence: number; // 0.0 to 1.0
}

export interface AuditResult {
  id?: string;
  createdAt?: string;
  input: AuditInput;
  recommendations: Recommendation[];
  totalCurrentSpend: number;
  totalOptimizedSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isOptimal: boolean;
  score: number; // 0-100 spend health score
}
