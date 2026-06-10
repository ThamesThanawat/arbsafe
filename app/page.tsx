import {
  Activity,
  Gauge,
  RadioTower,
  ShieldCheck,
  Smartphone,
  TrendingUp,
} from "lucide-react";
import { OpportunityCard } from "@/components/OpportunityCard";
import { opportunities } from "@/lib/mockOpportunities";
import { scoreOpportunity } from "@/lib/scoring";

export default function Home() {
  const scoredOpportunities = opportunities.map((opportunity) => ({
    opportunity,
    scored: scoreOpportunity(opportunity),
  }));
  const goodCount = scoredOpportunities.filter(
    ({ scored }) => scored.recommendation === "Good opportunity",
  ).length;
  const watchCount = scoredOpportunities.filter(
    ({ scored }) => scored.recommendation === "Watch only",
  ).length;
  const avoidCount = scoredOpportunities.filter(
    ({ scored }) => scored.recommendation === "Avoid",
  ).length;

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl overflow-hidden px-4 py-5 sm:px-6 sm:py-8">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-950 text-white">
            <ShieldCheck aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-black text-zinc-950">ArbSafe</p>
            <p className="text-sm text-zinc-500">Mock PM arb v1</p>
          </div>
        </div>
        <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-bold text-zinc-700">
          Demo
        </span>
      </header>

      <section className="mt-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
          Not every spread is an opportunity.
        </p>
        <h1 className="mt-3 text-4xl font-black leading-none text-zinc-950 sm:text-5xl">
          Prediction-market spreads, risk-adjusted.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
          ArbSafe checks mock Kalshi (Solana) and Polymarket (via Jupiter)
          opportunities after fees, slippage, liquidity, execution delay, and
          settlement-rule mismatch.
        </p>
      </section>

      <section className="mt-6 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
          <div className="flex items-center gap-2 text-emerald-700">
            <TrendingUp aria-hidden="true" className="h-4 w-4" />
            <span className="text-xs font-bold">Good</span>
          </div>
          <p className="mt-2 text-2xl font-black tabular-nums text-emerald-800">
            {goodCount}
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-center gap-2 text-amber-700">
            <Gauge aria-hidden="true" className="h-4 w-4" />
            <span className="text-xs font-bold">Watch</span>
          </div>
          <p className="mt-2 text-2xl font-black tabular-nums text-amber-800">
            {watchCount}
          </p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <div className="flex items-center gap-2 text-red-700">
            <Activity aria-hidden="true" className="h-4 w-4" />
            <span className="text-xs font-bold">Avoid</span>
          </div>
          <p className="mt-2 text-2xl font-black tabular-nums text-red-800">
            {avoidCount}
          </p>
        </div>
      </section>

      <section className="mt-6 space-y-4">
        {opportunities.map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))}
      </section>

      <footer className="mt-6 rounded-lg border border-zinc-200 bg-white p-4 shadow-soft">
        <div className="flex items-center gap-2">
          <RadioTower aria-hidden="true" className="h-5 w-5 text-teal-700" />
          <h2 className="text-lg font-black text-zinc-950">
            Future infrastructure
          </h2>
        </div>
        <div className="mt-4 grid gap-3 text-sm leading-6 text-zinc-600">
          <p>
            DFlow can be the future tokenized Kalshi and Solana
            prediction-market data layer.
          </p>
          <p>
            Jupiter Prediction can provide Kalshi + Polymarket market access in
            a later version.
          </p>
          <p>
            MagicBlock Oracles can become a low-latency price-feed layer for
            time-sensitive monitoring.
          </p>
          <p className="flex gap-2 font-semibold text-zinc-700">
            <Smartphone aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-blue-600" />
            Solana Mobile / Seeker is the mobile-first distribution path.
          </p>
        </div>
        <p className="mt-4 rounded-lg bg-zinc-50 px-3 py-2 text-xs font-semibold leading-5 text-zinc-500">
          Current MVP uses mock data only and does not execute trades.
        </p>
      </footer>
    </main>
  );
}
