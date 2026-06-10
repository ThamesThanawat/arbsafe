import type { ArbitrageOpportunity } from "./types";

export const opportunities: ArbitrageOpportunity[] = [
  {
    id: "kalshi-polymarket-sol-etf-clean",
    title: "SOL ETF approval clean spread",
    type: "Prediction market arbitrage",
    asset: "SOL ETF YES",
    venues: {
      buy: "Kalshi (Solana)",
      sell: "Polymarket (via Jupiter)",
    },
    updatedAgo: "42s ago",
    thesis:
      "Both mock markets describe the same approval event with similar settlement timing, so the spread survives the first risk pass.",
    whyScore:
      "The score is high because the estimated net spread stays positive, liquidity coverage is deep, and settlement rules appear closely matched.",
    grossSpreadBps: 162,
    estimatedFeesBps: 12,
    estimatedSlippageBps: 18,
    estimatedLiquidityImpactBps: 14,
    estimatedSettlementRuleRiskBps: 8,
    liquidityDepthUsd: 320000,
    tradeSizeUsd: 20000,
    lockupLabel: "Same-week resolution window",
    executionDelaySeconds: 4,
    executionRisk: "low",
    timeSensitivity: "medium",
    venueRisk: "low",
    settlementMismatchRisk: "low",
    marketRuleMismatchRisk: "low",
    operationalRisk: "low",
    nextSteps: [
      "Recheck both market rules before treating the contracts as equivalent.",
      "Watch liquidity and spread decay before making any decision.",
    ],
  },
  {
    id: "kalshi-polymarket-rate-cut-watch",
    title: "Fed rate cut probability spread",
    type: "Prediction market arbitrage",
    asset: "Fed cut by next meeting YES",
    venues: {
      buy: "Kalshi (Solana)",
      sell: "Polymarket (via Jupiter)",
    },
    updatedAgo: "2m ago",
    thesis:
      "The market question is close, but the mock venues may treat timing and official source language differently.",
    whyScore:
      "The score lands in Watch only because the net estimate is positive but fees, slippage, and rule confidence leave little margin.",
    grossSpreadBps: 85,
    estimatedFeesBps: 16,
    estimatedSlippageBps: 24,
    estimatedLiquidityImpactBps: 20,
    estimatedSettlementRuleRiskBps: 6,
    liquidityDepthUsd: 185000,
    tradeSizeUsd: 30000,
    lockupLabel: "Event-dependent resolution",
    executionDelaySeconds: 12,
    executionRisk: "medium",
    timeSensitivity: "medium",
    venueRisk: "medium",
    settlementMismatchRisk: "low",
    marketRuleMismatchRisk: "medium",
    operationalRisk: "medium",
    nextSteps: [
      "Compare the exact resolution source and deadline on both markets.",
      "Wait for a wider net spread or deeper liquidity before upgrading the signal.",
    ],
  },
  {
    id: "kalshi-polymarket-election-trap",
    title: "Headline election spread trap",
    type: "Prediction market arbitrage",
    asset: "Election outcome YES",
    venues: {
      buy: "Kalshi (Solana)",
      sell: "Polymarket (via Jupiter)",
    },
    updatedAgo: "15s ago",
    thesis:
      "Everyone clicks this because the spread looks huge. ArbSafe shows why it is actually a trap.",
    whyScore:
      "The score is low because most of the headline spread is consumed by slippage, thin liquidity, execution delay, and settlement/rule mismatch.",
    demoCallout:
      "High gross spread, weak real opportunity after risk adjustment.",
    grossSpreadBps: 500,
    estimatedFeesBps: 25,
    estimatedSlippageBps: 110,
    estimatedLiquidityImpactBps: 140,
    estimatedSettlementRuleRiskBps: 216,
    liquidityDepthUsd: 70000,
    tradeSizeUsd: 50000,
    lockupLabel: "Potential multi-week lockup",
    executionDelaySeconds: 28,
    executionRisk: "high",
    timeSensitivity: "high",
    venueRisk: "high",
    settlementMismatchRisk: "high",
    marketRuleMismatchRisk: "high",
    operationalRisk: "high",
    nextSteps: [
      "Do not treat the +5.00% headline spread as a clean arbitrage.",
      "Check matching settlement language and real depth before watching again.",
    ],
  },
];

export function getOpportunityById(id: string): ArbitrageOpportunity | undefined {
  return opportunities.find((opportunity) => opportunity.id === id);
}
