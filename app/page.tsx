import { Activity, Gauge, ShieldCheck, TrendingUp } from "lucide-react";
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
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-5 sm:px-6 sm:py-8">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-950 text-white">
            <ShieldCheck aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-black text-zinc-950">ArbSafe</p>
            <p className="text-sm text-zinc-500">Mock Solana v1</p>
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
          Risk-adjusted arbitrage monitor for Solana.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
          ArbSafe ranks mock arbitrage spreads after fees, slippage, liquidity,
          execution delay, venue risk, settlement mismatch, market rules, and
          operational risk.
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

      <section className="mt-6 space-y-4 pb-8">
        {opportunities.map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))}
      </section>
    </main>
  );
}
