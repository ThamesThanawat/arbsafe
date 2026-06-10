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
  whyScore: string;
  demoCallout?: string;
  grossSpreadBps: number;
  estimatedFeesBps: number;
  estimatedSlippageBps: number;
  estimatedLiquidityImpactBps: number;
  estimatedSettlementRuleRiskBps: number;
  liquidityDepthUsd: number;
  tradeSizeUsd: number;
  lockupLabel: string;
  executionDelaySeconds: number;
  executionRisk: RiskLevel;
  timeSensitivity: RiskLevel;
  venueRisk: RiskLevel;
  settlementMismatchRisk: RiskLevel;
  marketRuleMismatchRisk: RiskLevel;
  operationalRisk: RiskLevel;
  nextSteps: string[];
};

export type GrossToNetLine = {
  label: string;
  bps: number;
  kind: "gross" | "deduction" | "net";
};

export type ScoreFactor = {
  label: string;
  weight: number;
  factorScore: number;
  contribution: number;
  helper: string;
};

export type ScoredOpportunity = {
  netOpportunityBps: number;
  arbSafeScore: number;
  recommendation: Recommendation;
  grossToNetLines: GrossToNetLine[];
  scoreFactors: ScoreFactor[];
  explanation: string[];
  riskChecks: string[];
  nextSteps: string[];
  liquidityCoverageRatio: number;
  liquidityRisk: RiskLevel;
  delayRisk: RiskLevel;
};
