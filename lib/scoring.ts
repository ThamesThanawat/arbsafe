import type {
  ArbitrageOpportunity,
  Recommendation,
  RiskLevel,
  ScoredOpportunity,
} from "./types";

const riskPenalty: Record<RiskLevel, number> = {
  low: 2,
  medium: 10,
  high: 24,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getLiquidityRisk(coverageRatio: number): RiskLevel {
  if (coverageRatio < 3) {
    return "high";
  }

  if (coverageRatio < 8) {
    return "medium";
  }

  return "low";
}

function getDelayRisk(delaySeconds: number): RiskLevel {
  if (delaySeconds >= 20) {
    return "high";
  }

  if (delaySeconds >= 8) {
    return "medium";
  }

  return "low";
}

function getRecommendation({
  netOpportunityBps,
  arbSafeScore,
  liquidityRisk,
  settlementMismatchRisk,
  marketRuleMismatchRisk,
}: {
  netOpportunityBps: number;
  arbSafeScore: number;
  liquidityRisk: RiskLevel;
  settlementMismatchRisk: RiskLevel;
  marketRuleMismatchRisk: RiskLevel;
}): Recommendation {
  const hasHighMismatch =
    settlementMismatchRisk === "high" || marketRuleMismatchRisk === "high";

  if (
    netOpportunityBps < 0 ||
    arbSafeScore < 45 ||
    liquidityRisk === "high" ||
    hasHighMismatch
  ) {
    return "Avoid";
  }

  if (netOpportunityBps > 0 && arbSafeScore >= 75 && !hasHighMismatch) {
    return "Good opportunity";
  }

  return "Watch only";
}

export function scoreOpportunity(
  opportunity: ArbitrageOpportunity,
): ScoredOpportunity {
  const netOpportunityBps =
    opportunity.grossSpreadBps -
    opportunity.estimatedFeesBps -
    opportunity.estimatedSlippageBps;

  const liquidityCoverageRatio =
    opportunity.liquidityDepthUsd / opportunity.tradeSizeUsd;
  const liquidityRisk = getLiquidityRisk(liquidityCoverageRatio);
  const delayRisk = getDelayRisk(opportunity.executionDelaySeconds);

  const riskInputs: RiskLevel[] = [
    opportunity.executionRisk,
    opportunity.timeSensitivity,
    opportunity.venueRisk,
    opportunity.settlementMismatchRisk,
    opportunity.marketRuleMismatchRisk,
    opportunity.operationalRisk,
    liquidityRisk,
    delayRisk,
  ];

  const totalRiskPenalty =
    riskInputs.reduce((total, level) => total + riskPenalty[level], 0) * 0.45;
  const spreadScore = clamp(netOpportunityBps * 0.35, -35, 35);
  const arbSafeScore = Math.round(clamp(65 + spreadScore - totalRiskPenalty, 0, 100));

  const recommendation = getRecommendation({
    netOpportunityBps,
    arbSafeScore,
    liquidityRisk,
    settlementMismatchRisk: opportunity.settlementMismatchRisk,
    marketRuleMismatchRisk: opportunity.marketRuleMismatchRisk,
  });

  return {
    netOpportunityBps,
    arbSafeScore,
    recommendation,
    explanation: buildExplanation({
      opportunity,
      netOpportunityBps,
      arbSafeScore,
      recommendation,
      liquidityCoverageRatio,
      liquidityRisk,
      delayRisk,
    }),
    riskChecks: buildRiskChecks(opportunity, liquidityRisk, delayRisk),
    nextSteps: buildNextSteps(recommendation),
    liquidityCoverageRatio,
    liquidityRisk,
    delayRisk,
  };
}

function buildExplanation({
  opportunity,
  netOpportunityBps,
  arbSafeScore,
  recommendation,
  liquidityCoverageRatio,
  liquidityRisk,
  delayRisk,
}: {
  opportunity: ArbitrageOpportunity;
  netOpportunityBps: number;
  arbSafeScore: number;
  recommendation: Recommendation;
  liquidityCoverageRatio: number;
  liquidityRisk: RiskLevel;
  delayRisk: RiskLevel;
}): string[] {
  const reasons: string[] = [];
  const costLoad =
    (opportunity.estimatedFeesBps + opportunity.estimatedSlippageBps) /
    opportunity.grossSpreadBps;

  if (netOpportunityBps > 0) {
    reasons.push(
      `Spread remains positive after fees and slippage at +${netOpportunityBps.toFixed(0)} bps.`,
    );
  } else {
    reasons.push(
      `Fees and slippage turn the quoted spread negative at ${netOpportunityBps.toFixed(0)} bps.`,
    );
  }

  if (costLoad >= 0.5) {
    reasons.push("Estimated fees and slippage consume at least half of the gross spread.");
  }

  if (liquidityRisk === "high") {
    reasons.push(
      `Liquidity depth is thin for the target size at ${liquidityCoverageRatio.toFixed(1)}x coverage.`,
    );
  } else if (liquidityRisk === "medium") {
    reasons.push(
      `Liquidity coverage is workable but not deep at ${liquidityCoverageRatio.toFixed(1)}x.`,
    );
  } else {
    reasons.push(
      `Liquidity coverage is healthy at ${liquidityCoverageRatio.toFixed(1)}x the target size.`,
    );
  }

  if (delayRisk !== "low") {
    reasons.push(
      `Execution delay is ${delayRisk} because the route may take about ${opportunity.executionDelaySeconds}s.`,
    );
  }

  const highRiskLabels = [
    ["execution risk", opportunity.executionRisk],
    ["time sensitivity", opportunity.timeSensitivity],
    ["venue risk", opportunity.venueRisk],
    ["settlement mismatch risk", opportunity.settlementMismatchRisk],
    ["market rule mismatch risk", opportunity.marketRuleMismatchRisk],
    ["operational risk", opportunity.operationalRisk],
  ].filter(([, level]) => level === "high");

  highRiskLabels.forEach(([label]) => {
    reasons.push(`High ${label} materially reduces tradability.`);
  });

  if (recommendation === "Good opportunity") {
    reasons.push(`ArbSafe score is ${arbSafeScore}, with a positive net estimate and no high mismatch risk.`);
  } else if (recommendation === "Watch only") {
    reasons.push(`ArbSafe score is ${arbSafeScore}, so the spread deserves monitoring before action.`);
  } else {
    reasons.push(`ArbSafe score is ${arbSafeScore}, so this setup should be avoided in the v1 model.`);
  }

  return reasons;
}

function buildRiskChecks(
  opportunity: ArbitrageOpportunity,
  liquidityRisk: RiskLevel,
  delayRisk: RiskLevel,
): string[] {
  const checks = [
    "Confirm the spread is still visible on both venues before relying on the quote.",
    "Recheck estimated fees and slippage for the intended position size.",
  ];

  if (liquidityRisk !== "low") {
    checks.push("Verify order book depth because liquidity coverage is not comfortably deep.");
  }

  if (delayRisk !== "low" || opportunity.timeSensitivity !== "low") {
    checks.push("Check whether the opportunity can survive the expected execution delay.");
  }

  if (
    opportunity.settlementMismatchRisk !== "low" ||
    opportunity.marketRuleMismatchRisk !== "low"
  ) {
    checks.push("Compare settlement terms and market rules before treating the legs as equivalent.");
  }

  if (opportunity.venueRisk !== "low" || opportunity.operationalRisk !== "low") {
    checks.push("Review venue limits, withdrawal timing, and operational steps before acting.");
  }

  return checks;
}

function buildNextSteps(recommendation: Recommendation): string[] {
  if (recommendation === "Good opportunity") {
    return [
      "Keep monitoring spread decay and liquidity before making any decision.",
      "Size conservatively and treat this as a due diligence signal, not execution advice.",
    ];
  }

  if (recommendation === "Watch only") {
    return [
      "Wait for either a wider net spread or lower risk inputs.",
      "Track the route until liquidity, fees, and timing improve together.",
    ];
  }

  return [
    "Avoid treating the headline spread as tradable in the current mock state.",
    "Look for a cleaner setup with positive net estimate and lower mismatch risk.",
  ];
}
