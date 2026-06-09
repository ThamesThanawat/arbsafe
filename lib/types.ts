export type OpportunityType =
  | "Prediction market arbitrage"
  | "Funding rate arbitrage"
  | "CEX-DEX arbitrage";

export type RiskLevel = "low" | "medium" | "high";

export type Recommendation = "Good opportunity" | "Watch only" | "Avoid";

export type VenuePair = {
  buy: string;
  sell: string;
};

export type ArbitrageOpportunity = {
  id: string;
  title: string;
  type: OpportunityType;
  asset: string;
  venues: VenuePair;
  updatedAgo: string;
  thesis: string;
  grossSpreadBps: number;
  estimatedFeesBps: number;
  estimatedSlippageBps: number;
  liquidityDepthUsd: number;
  tradeSizeUsd: number;
  executionDelaySeconds: number;
  executionRisk: RiskLevel;
  timeSensitivity: RiskLevel;
  venueRisk: RiskLevel;
  settlementMismatchRisk: RiskLevel;
  marketRuleMismatchRisk: RiskLevel;
  operationalRisk: RiskLevel;
};

export type ScoredOpportunity = {
  netOpportunityBps: number;
  arbSafeScore: number;
  recommendation: Recommendation;
  explanation: string[];
  riskChecks: string[];
  nextSteps: string[];
  liquidityCoverageRatio: number;
  liquidityRisk: RiskLevel;
  delayRisk: RiskLevel;
};
