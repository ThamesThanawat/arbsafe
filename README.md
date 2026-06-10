# ArbSafe

**Not every spread is an opportunity.**

ArbSafe is a mobile-first hackathon MVP for Solana prediction-market users who want to evaluate whether an arbitrage spread is actually tradable after risk and execution costs.

Many tools show gross spreads. ArbSafe estimates whether a Kalshi (Solana) vs Polymarket (via Jupiter) price gap still makes sense after fees, slippage, liquidity depth, execution delay, settlement mismatch, market rule mismatch, and operational risk.

Core question:

```text
Is this spread still worth it after real execution risk?
```

## MVP scope

- Next.js, TypeScript, and Tailwind CSS
- Mock data only for v1
- Home page with arbitrage opportunity cards
- Detail page for each opportunity
- Risk-adjusted net opportunity estimate
- ArbSafe score from 0 to 100
- Recommendation label: `Good opportunity`, `Watch only`, or `Avoid`
- Rule-based explanation for each recommendation
- Risks to check and next steps for each mock opportunity

## Mock opportunity focus

- Prediction-market arbitrage between `Kalshi (Solana)` and `Polymarket (via Jupiter)`
- A high-gross trap opportunity where the headline spread is large but the risk-adjusted estimate is weak
- Mock data only; no live Kalshi, Polymarket, Jupiter, DFlow, or MagicBlock integration

## What this does not do

- No smart contract
- No real trade execution
- No private keys or seed phrases
- No real APIs
- No wallet login
- No auth or database

## Scoring model

The v1 scoring model is intentionally simple and demo-friendly.

```text
net opportunity =
  gross spread
  - estimated fees
  - estimated slippage
  - estimated liquidity impact
  - estimated settlement / rule risk
```

The ArbSafe score is a weighted contribution model:

- Liquidity: 30%
- Execution risk: 25%
- Fee + slippage: 25%
- Settlement / rule mismatch: 20%

Each opportunity detail page shows the factor contribution so the score does not feel like a black box.

Recommendation rules:

- `Good opportunity`: positive net estimate, score of 75 or higher, and no high mismatch risk
- `Watch only`: positive or near-break-even setup with moderate risk
- `Avoid`: negative net estimate, score below 45, severe liquidity weakness, or high settlement/rule mismatch

## Settlement rule risk

Kalshi and Polymarket may resolve markets using different rules, timelines, data sources, or dispute processes. ArbSafe treats this as first-class risk because a price gap is not a true arbitrage if the two sides do not settle under matching rules.

## Future infrastructure

- DFlow: tokenized Kalshi / Solana prediction-market data
- Jupiter Prediction: Kalshi + Polymarket market access
- MagicBlock Oracles: future low-latency price-feed layer for time-sensitive monitoring
- Solana Mobile / Seeker: mobile-first distribution path

The current MVP uses mock data only and does not execute trades.

## Run locally

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Validate

Run linting:

```bash
npm run lint
```

Run a production build:

```bash
npm run build
```

## Manual demo checklist

- Home page renders all mock opportunities
- Each card opens an opportunity detail page
- Detail page shows gross spread, fees, slippage, liquidity impact, settlement/rule risk, liquidity depth, execution risk, time sensitivity, net estimate, ArbSafe score, and recommendation
- Mock data includes at least one `Good opportunity`, one `Watch only`, and one `Avoid`
- UI is readable on a mobile viewport
- No console errors or horizontal overflow on mobile
