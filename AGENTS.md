# AGENTS.md

## Project: ArbSafe

ArbSafe is a mobile-first, risk-adjusted arbitrage monitor for Solana users.

Core tagline:

> Not every spread is an opportunity.

ArbSafe helps users evaluate whether an apparent arbitrage spread is actually worth watching after accounting for fees, slippage, liquidity, execution delay, venue risk, settlement mismatch, market rule mismatch, and operational complexity.

This project is for a Solana hackathon MVP at IslandDAO V4.

---

## Product Positioning

ArbSafe is **not** a trading bot.

ArbSafe is **not** a financial advisor.

ArbSafe must not claim:

- guaranteed profit
- zero risk
- automatic execution
- risk-free arbitrage
- investment advice

ArbSafe should be positioned as:

- an arbitrage due diligence layer
- a risk-adjusted opportunity monitor
- a mobile-first trading intelligence tool
- a product that helps users understand risk before acting

The main user question ArbSafe answers is:

> “Is this spread actually tradable, or is it just misleading?”

---

## Build Priority

Prioritize hackathon shipping over perfect architecture.

The MVP should be simple, polished, and easy to demo.

Build the product in this order:

1. Mobile-first UI
2. Mock arbitrage opportunity data
3. Opportunity list page
4. Opportunity detail page
5. Risk scoring logic
6. Clear recommendation labels
7. Risk explanation and next steps
8. README and demo-ready polish

Do not overbuild infrastructure in v1.

---

## MVP Scope

The MVP should include:

- Opportunity list
- Opportunity detail page
- Gross spread
- Estimated fees
- Estimated slippage
- Liquidity depth or liquidity score
- Execution risk
- Time sensitivity
- Rule or settlement mismatch risk
- Net opportunity estimate
- ArbSafe score
- Recommendation label:
  - Good opportunity
  - Watch only
  - Avoid

- Explanation of why the recommendation was given
- Risks to check before acting
- Next steps for the user

---

## Out of Scope for v1

Do not build these in the MVP unless explicitly requested later:

- real trade execution
- smart contracts
- private key handling
- seed phrase input
- wallet transaction signing
- automated trading bot
- native iOS or Android app
- complex backend
- production database
- live order routing
- liquidation engine
- complex AI agent framework

Use mock data first.

Optional API integrations can be added later only if the MVP is already working.

---

## Preferred Tech Stack

Use:

- Next.js
- TypeScript
- Tailwind CSS
- Mobile-first responsive design
- Mock data stored locally in TypeScript or JSON
- Simple rule-based scoring logic

Optional later integrations:

- DFlow API
- Jupiter
- Helius
- DexScreener
- Pyth / Pyth Lazer
- MagicBlock infrastructure
- Solana Mobile Wallet Adapter

But for v1, default to mock data.

---

## Mobile-First Design

Design for mobile first, especially Solana Seeker-style usage.

The app should feel like a mobile trading intelligence app.

The user flow should be:

1. User sees an apparent arbitrage opportunity on Telegram, X, or another app
2. User opens ArbSafe on mobile
3. User quickly checks whether the spread is real or risky
4. User sees a simple score, recommendation, and explanation

Prioritize:

- readable cards
- clear numbers
- simple risk badges
- fast scanning
- thumb-friendly layout
- strong visual hierarchy
- clean opportunity detail page

Avoid dense desktop-dashboard UI.

---

## Core Data Model

Each mock arbitrage opportunity should include fields similar to:

```ts
type ArbitrageOpportunity = {
  id: string;
  type: "prediction_market" | "funding_rate" | "cex_dex" | "generic";
  asset: string;

  venueA: string;
  venueB: string;

  marketA: string;
  marketB: string;

  grossSpread: number;
  estimatedFees: number;
  estimatedSlippage: number;

  liquidityScore: number;
  executionRisk: number;
  timeSensitivity: number;
  ruleMatchConfidence: number;

  netOpportunity: number;
  arbSafeScore: number;

  recommendation: "Good opportunity" | "Watch only" | "Avoid";

  explanation: string;
  risks: string[];
  nextSteps: string[];
};
```

---

## Risk Scoring Logic

Use a simple, explainable rule-based scoring model.

The score does not need to be mathematically perfect. It must be easy for users and judges to understand.

Suggested logic:

```ts
netOpportunity = grossSpread - estimatedFees - estimatedSlippage;
```

Start from a base score of 100, then subtract penalties:

- high fees reduce score
- high slippage reduces score
- low liquidity reduces score
- high execution risk reduces score
- high time sensitivity reduces score
- low rule match confidence reduces score
- negative or weak net opportunity heavily reduces score

Suggested labels:

```ts
if (arbSafeScore >= 75 && netOpportunity > 0) {
  recommendation = "Good opportunity";
} else if (arbSafeScore >= 50) {
  recommendation = "Watch only";
} else {
  recommendation = "Avoid";
}
```

The UI must explain why the opportunity received its score.

Do not show only the score. Always show the reasoning.

---

## Recommendation Philosophy

Recommendation labels should be conservative.

If risk is unclear, prefer:

> Watch only

If net opportunity is negative or execution risk is high, prefer:

> Avoid

Only use:

> Good opportunity

when the mock opportunity has:

- positive net opportunity
- acceptable fees
- acceptable slippage
- decent liquidity
- manageable execution risk
- reasonable rule or settlement match

Never imply that “Good opportunity” means guaranteed profit.

---

## Product Voice

Use clear, responsible language.

Good language:

- “Estimated net opportunity”
- “Risk-adjusted score”
- “Watch before acting”
- “Check liquidity and execution timing”
- “This spread may disappear quickly”
- “Settlement rules may not match”
- “This is a monitoring tool, not execution advice”

Avoid language like:

- “guaranteed profit”
- “risk-free”
- “sure win”
- “execute now”
- “free money”
- “automatic arbitrage”

---

## DFlow Narrative

DFlow may be relevant as a future data and execution infrastructure source.

Possible future uses:

- Solana spot quote comparison
- tokenized Kalshi prediction market data
- prediction market arbitrage monitoring
- AI-powered trading tool infrastructure

For the MVP:

- do not require DFlow integration
- use mock data first
- mention DFlow as a possible future integration if relevant in README or pitch

ArbSafe should not try to become a prediction market venue. It should be the intelligence and risk layer on top.

---

## MagicBlock Narrative

MagicBlock may be relevant for future real-time arbitrage infrastructure.

Relevant concepts:

- Ephemeral Rollups
- low-latency real-time applications
- real-time oracles
- Pyth Lazer
- Private Ephemeral Rollups

For the MVP:

- do not build on MagicBlock directly unless explicitly requested
- use MagicBlock as a future narrative for faster real-time monitoring
- emphasize that arbitrage is time-sensitive, so low-latency infrastructure could matter later

Do not overbuild real-time execution in v1.

---

## Seeker / Solana Mobile Narrative

ArbSafe should be mobile-first and Seeker-ready in narrative.

For the MVP:

- build a responsive web app or PWA-style interface
- optimize for mobile screens
- keep the app fast and easy to scan
- do not build native mobile unless explicitly requested

Future possibilities:

- Solana Mobile Wallet Adapter
- Solana dApp Store distribution
- push notifications for watchlisted opportunities
- mobile-native trading intelligence UX

---

## Coding Guidelines

Use clean, simple TypeScript.

Prefer:

- readable components
- small utility functions
- clear mock data
- simple scoring logic
- reusable UI cards
- responsive Tailwind classes
- minimal dependencies

Avoid:

- unnecessary backend complexity
- premature optimization
- large state management libraries
- complicated abstractions
- unfinished integrations
- fake production claims

When choosing between a simple working MVP and an ambitious incomplete system, choose the simple working MVP.

---

## Suggested App Structure

A simple structure is preferred:

```txt
app/
  page.tsx
  opportunities/
    [id]/
      page.tsx

components/
  OpportunityCard.tsx
  ScoreBadge.tsx
  RiskBreakdown.tsx
  RecommendationBadge.tsx

lib/
  mock-opportunities.ts
  scoring.ts
  types.ts
```

---

## Demo Goal

The demo should clearly show:

1. A list of arbitrage opportunities
2. Different recommendation labels
3. A detail page explaining one opportunity
4. Gross spread versus net opportunity
5. Risk factors reducing the score
6. Why ArbSafe says Good opportunity, Watch only, or Avoid

The judge should understand in under 30 seconds:

> ArbSafe does not just show spreads. It tells you whether the spread survives real-world trading risk.

---

## Default Decision Rules

When uncertain:

- prioritize mock data
- prioritize mobile UI
- prioritize risk explanation
- prioritize demo clarity
- avoid real execution
- avoid scope creep
- keep the product credible and responsible

Always separate:

- MVP now
- future version

---
