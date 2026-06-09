# ArbSafe

**Not every spread is an opportunity.**

ArbSafe is a mobile-first hackathon MVP for Solana users who want to evaluate whether an arbitrage spread is actually tradable after risk and execution costs.

Many tools show gross spreads. ArbSafe estimates whether the opportunity still makes sense after fees, slippage, liquidity depth, execution delay, venue risk, settlement mismatch, market rule mismatch, and operational risk.

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

## Mock opportunity types

- Prediction market arbitrage
- Funding rate arbitrage
- CEX-DEX arbitrage

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
net opportunity = gross spread - estimated fees - estimated slippage
```

The ArbSafe score starts from the net opportunity estimate and subtracts penalties for:

- Liquidity depth weakness
- Execution delay
- Execution risk
- Time sensitivity
- Venue risk
- Settlement mismatch risk
- Market rule mismatch risk
- Operational risk

Recommendation rules:

- `Good opportunity`: positive net estimate, score of 75 or higher, and no high mismatch risk
- `Watch only`: positive or near-break-even setup with moderate risk
- `Avoid`: negative net estimate, score below 45, severe liquidity weakness, or high settlement/rule mismatch

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
- Detail page shows gross spread, fees, slippage, liquidity depth, execution risk, time sensitivity, settlement/rule mismatch, net estimate, ArbSafe score, and recommendation
- Mock data includes at least one `Good opportunity`, one `Watch only`, and one `Avoid`
- UI is readable on a mobile viewport
