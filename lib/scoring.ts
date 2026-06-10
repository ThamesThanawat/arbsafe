import type {
  ArbitrageOpportunity,
  GrossToNetLine,
  Recommendation,
  RiskLevel,
  ScoredOpportunity,
  ScoreFactor,
} from "./types";

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

function getRiskBaseScore(level: RiskLevel): number {
  switch (level) {
    case "low":
      return 92;
    case "medium":
      return 64;
    case "high":
      return 34;
  }
}

function getLiquidityFactorScore(coverageRatio: number): number {
  if (coverageRatio >= 12) {
    return 92;
  }

  if (coverageRatio >= 8) {
    return 82;
  }

  if (coverageRatio >= 4) {
    return 65;
  }

  if (coverageRatio >= 2) {
    return 42;
  }

  return 25;
}

function getExecutionFactorScore(
  executionRisk: RiskLevel,
  delayRisk: RiskLevel,
): number {
  const delayPenalty = {
    low: 0,
    medium: 8,
    high: 14,
  } satisfies Record<RiskLevel, number>;

  return clamp(getRiskBaseScore(executionRisk) - delayPenalty[delayRisk], 0, 100);
}

function getFeeSlippageFactorScore(
  opportunity: ArbitrageOpportunity,
): number {
  const feeAndSlippageRatio =
    (opportunity.estimatedFeesBps + opportunity.estimatedSlippageBps) /
    opportunity.grossSpreadBps;

  return clamp(100 - feeAndSlippageRatio * 95, 0, 100);
}

function getSettlementFactorScore(opportunity: ArbitrageOpportunity): number {
  const highestMismatch =
    opportunity.settlementMismatchRisk === "high" ||
    opportunity.marketRuleMismatchRisk === "high"
      ? "high"
      : opportunity.settlementMismatchRisk === "medium" ||
          opportunity.marketRuleMismatchRisk === "medium"
        ? "medium"
        : "low";

  const riskAdjustmentRatio =
    opportunity.estimatedSettlementRuleRiskBps / opportunity.grossSpreadBps;

  return clamp(
    getRiskBaseScore(highestMismatch) - riskAdjustmentRatio * 55,
    0,
    100,
  );
}

function buildScoreFactors({
  opportunity,
  liquidityCoverageRatio,
  delayRisk,
}: {
  opportunity: ArbitrageOpportunity;
  liquidityCoverageRatio: number;
  delayRisk: RiskLevel;
}): ScoreFactor[] {
  const factors = [
    {
      label: "Liquidity",
      weight: 30,
      factorScore: getLiquidityFactorScore(liquidityCoverageRatio),
      helper: `${liquidityCoverageRatio.toFixed(1)}x depth coverage versus target size.`,
    },
    {
      label: "Execution risk",
      weight: 25,
      factorScore: getExecutionFactorScore(opportunity.executionRisk, delayRisk),
      helper: `${opportunity.executionDelaySeconds}s mock route delay with ${opportunity.executionRisk} execution risk.`,
    },
    {
      label: "Fee + slippage",
      weight: 25,
      factorScore: getFeeSlippageFactorScore(opportunity),
      helper: `${(
        opportunity.estimatedFeesBps + opportunity.estimatedSlippageBps
      ).toFixed(0)} bps before liquidity and rule risk.`,
    },
    {
      label: "Settlement / rule mismatch",
      weight: 20,
      factorScore: getSettlementFactorScore(opportunity),
      helper: `${opportunity.settlementMismatchRisk} settlement risk and ${opportunity.marketRuleMismatchRisk} market-rule risk.`,
    },
  ];

  return factors.map((factor) => ({
    ...factor,
    factorScore: Math.round(factor.factorScore),
    contribution: Math.round((factor.factorScore * factor.weight) / 100),
  }));
}

function buildGrossToNetLines(
  opportunity: ArbitrageOpportunity,
  netOpportunityBps: number,
): GrossToNetLine[] {
  return [
    {
      label: "Gross spread",
      bps: opportunity.grossSpreadBps,
      kind: "gross",
    },
    {
      label: "Fees",
      bps: -opportunity.estimatedFeesBps,
      kind: "deduction",
    },
    {
      label: "Slippage",
      bps: -opportunity.estimatedSlippageBps,
      kind: "deduction",
    },
    {
      label: "Liquidity impact",
      bps: -opportunity.estimatedLiquidityImpactBps,
      kind: "deduction",
    },
    {
      label: "Settlement / rule risk",
      bps: -opportunity.estimatedSettlementRuleRiskBps,
      kind: "deduction",
    },
    {
      label: "Net estimate",
      bps: netOpportunityBps,
      kind: "net",
    },
  ];
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
    opportunity.estimatedSlippageBps -
    opportunity.estimatedLiquidityImpactBps -
    opportunity.estimatedSettlementRuleRiskBps;

  const liquidityCoverageRatio =
    opportunity.liquidityDepthUsd / opportunity.tradeSizeUsd;
  const liquidityRisk = getLiquidityRisk(liquidityCoverageRatio);
  const delayRisk = getDelayRisk(opportunity.executionDelaySeconds);
  const scoreFactors = buildScoreFactors({
    opportunity,
    liquidityCoverageRatio,
    delayRisk,
  });
  const arbSafeScore = Math.round(
    clamp(
      scoreFactors.reduce((total, factor) => total + factor.contribution, 0),
      0,
      100,
    ),
  );

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
    grossToNetLines: buildGrossToNetLines(opportunity, netOpportunityBps),
    scoreFactors,
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
    nextSteps: buildNextSteps(opportunity, recommendation),
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
    (opportunity.estimatedFeesBps +
      opportunity.estimatedSlippageBps +
      opportunity.estimatedLiquidityImpactBps +
      opportunity.estimatedSettlementRuleRiskBps) /
    opportunity.grossSpreadBps;

  reasons.push(opportunity.whyScore);

  if (netOpportunityBps > 0) {
    reasons.push(
      `Estimated net spread remains positive at +${netOpportunityBps.toFixed(0)} bps after modeled costs and risk deductions.`,
    );
  } else {
    reasons.push(
      `Modeled costs and risk deductions turn the quoted spread negative at ${netOpportunityBps.toFixed(0)} bps.`,
    );
  }

  if (costLoad >= 0.5) {
    reasons.push("Estimated costs and risk deductions consume at least half of the gross spread.");
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

  if (
    opportunity.settlementMismatchRisk !== "low" ||
    opportunity.marketRuleMismatchRisk !== "low"
  ) {
    reasons.push(
      "Kalshi and Polymarket may not settle under identical rules, timelines, data sources, or dispute processes.",
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
    "Recheck estimated fees, slippage, liquidity impact, and rule risk for the intended position size.",
  ];

  if (liquidityRisk !== "low") {
    checks.push("Verify order book depth because liquidity coverage is not comfortably deep.");
  }

  if (delayRisk !== "low" || opportunity.timeSensitivity !== "low") {
    checks.push("Check whether the opportunity can survive the expected execution delay.");
  }

  if (opportunity.lockupLabel) {
    checks.push(`Account for lockup timing: ${opportunity.lockupLabel}.`);
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

function buildNextSteps(
  opportunity: ArbitrageOpportunity,
  recommendation: Recommendation,
): string[] {
  if (opportunity.nextSteps.length > 0) {
    return opportunity.nextSteps.slice(0, 2);
  }

  if (recommendation === "Good opportunity") {
    return [
      "Keep monitoring spread decay and liquidity before making any decision.",
      "Treat this as a due diligence signal, not financial advice.",
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
