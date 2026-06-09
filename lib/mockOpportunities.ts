import type { ArbitrageOpportunity } from "./types";

export const opportunities: ArbitrageOpportunity[] = [
  {
    id: "prediction-sol-etf",
    title: "SOL ETF approval market spread",
    type: "Prediction market arbitrage",
    asset: "SOL ETF YES",
    venues: {
      buy: "MetaDAO prediction pool",
      sell: "Parcl-style binary market",
    },
    updatedAgo: "42s ago",
    thesis:
      "Two mock prediction venues price the same approval outcome differently while liquidity is still deep enough for the target size.",
    grossSpreadBps: 180,
    estimatedFeesBps: 12,
    estimatedSlippageBps: 20,
    liquidityDepthUsd: 250000,
    tradeSizeUsd: 20000,
    executionDelaySeconds: 3,
    executionRisk: "low",
    timeSensitivity: "medium",
    venueRisk: "low",
    settlementMismatchRisk: "low",
    marketRuleMismatchRisk: "low",
    operationalRisk: "low",
  },
  {
    id: "funding-sol-perp",
    title: "SOL perp funding carry",
    type: "Funding rate arbitrage",
    asset: "SOL-PERP",
    venues: {
      buy: "Drift mock perp",
      sell: "Backpack mock perp",
    },
    updatedAgo: "2m ago",
    thesis:
      "Funding difference is attractive, but venue and operational risk make the carry less clean than the headline rate suggests.",
    grossSpreadBps: 65,
    estimatedFeesBps: 18,
    estimatedSlippageBps: 8,
    liquidityDepthUsd: 500000,
    tradeSizeUsd: 75000,
    executionDelaySeconds: 10,
    executionRisk: "medium",
    timeSensitivity: "medium",
    venueRisk: "medium",
    settlementMismatchRisk: "low",
    marketRuleMismatchRisk: "low",
    operationalRisk: "medium",
  },
  {
    id: "cex-dex-jup",
    title: "JUP spot CEX-DEX mismatch",
    type: "CEX-DEX arbitrage",
    asset: "JUP/USDC",
    venues: {
      buy: "Phoenix mock DEX",
      sell: "Centralized exchange mock book",
    },
    updatedAgo: "15s ago",
    thesis:
      "The quoted spread looks wide, but slippage, thin local depth, and settlement mismatch make the trade unreliable.",
    grossSpreadBps: 120,
    estimatedFeesBps: 35,
    estimatedSlippageBps: 105,
    liquidityDepthUsd: 75000,
    tradeSizeUsd: 50000,
    executionDelaySeconds: 24,
    executionRisk: "high",
    timeSensitivity: "high",
    venueRisk: "high",
    settlementMismatchRisk: "high",
    marketRuleMismatchRisk: "medium",
    operationalRisk: "high",
  },
];

export function getOpportunityById(id: string): ArbitrageOpportunity | undefined {
  return opportunities.find((opportunity) => opportunity.id === id);
}
