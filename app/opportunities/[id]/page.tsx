import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock3,
  Layers,
  ReceiptText,
  Route,
  ShieldAlert,
  Waves,
} from "lucide-react";
import { MetricBlock } from "@/components/MetricBlock";
import { RecommendationBadge } from "@/components/RecommendationBadge";
import { RiskBadge } from "@/components/RiskBadge";
import { ScoreBar } from "@/components/ScoreBar";
import { formatBps, formatRatio, formatUsd } from "@/lib/format";
import { getOpportunityById, opportunities } from "@/lib/mockOpportunities";
import { scoreOpportunity } from "@/lib/scoring";
import type { RiskLevel } from "@/lib/types";

type OpportunityPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return opportunities.map((opportunity) => ({
    id: opportunity.id,
  }));
}

function riskTone(level: RiskLevel): "positive" | "warning" | "danger" {
  if (level === "low") {
    return "positive";
  }

  if (level === "medium") {
    return "warning";
  }

  return "danger";
}

export default async function OpportunityDetailPage({
  params,
}: OpportunityPageProps) {
  const { id } = await params;
  const opportunity = getOpportunityById(id);

  if (!opportunity) {
    notFound();
  }

  const scored = scoreOpportunity(opportunity);
  const netTone = scored.netOpportunityBps >= 0 ? "positive" : "danger";

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-5 sm:px-6 sm:py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition hover:border-zinc-300"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Opportunities
      </Link>

      <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
              {opportunity.type}
            </p>
            <h1 className="mt-2 text-3xl font-black leading-tight text-zinc-950">
              {opportunity.title}
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              {opportunity.thesis}
            </p>
          </div>
          <RecommendationBadge recommendation={scored.recommendation} />
        </div>

        <div className="mt-6">
          <ScoreBar score={scored.arbSafeScore} />
        </div>

        <div className="mt-6 grid gap-3 text-sm">
          <div className="flex items-start gap-3">
            <Route aria-hidden="true" className="mt-0.5 h-5 w-5 text-blue-600" />
            <div>
              <p className="font-bold text-zinc-950">{opportunity.asset}</p>
              <p className="mt-1 text-zinc-500">
                Buy on {opportunity.venues.buy}; sell on {opportunity.venues.sell}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-zinc-500">
            <Clock3 aria-hidden="true" className="h-5 w-5 text-zinc-400" />
            Updated {opportunity.updatedAgo}
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-zinc-200 bg-white p-5 shadow-soft">
        <div className="flex items-center gap-2">
          <ReceiptText aria-hidden="true" className="h-5 w-5 text-teal-700" />
          <h2 className="text-lg font-black text-zinc-950">Spread breakdown</h2>
        </div>
        <div className="mt-3">
          <MetricBlock
            label="Gross spread"
            value={formatBps(opportunity.grossSpreadBps)}
            helper="Quoted difference before trade frictions."
          />
          <MetricBlock
            label="Estimated fees"
            value={`-${opportunity.estimatedFeesBps.toFixed(0)} bps`}
            helper="Mock taker, venue, and transfer cost estimate."
            tone="warning"
          />
          <MetricBlock
            label="Estimated slippage"
            value={`-${opportunity.estimatedSlippageBps.toFixed(0)} bps`}
            helper="Price impact estimate for the target size."
            tone="warning"
          />
          <MetricBlock
            label="Net opportunity estimate"
            value={formatBps(scored.netOpportunityBps)}
            helper="Gross spread less estimated fees and slippage."
            tone={netTone}
          />
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-zinc-200 bg-white p-5 shadow-soft">
        <div className="flex items-center gap-2">
          <Waves aria-hidden="true" className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-black text-zinc-950">Liquidity and timing</h2>
        </div>
        <div className="mt-3">
          <MetricBlock
            label="Liquidity depth"
            value={formatUsd(opportunity.liquidityDepthUsd)}
            helper={`Target trade size: ${formatUsd(opportunity.tradeSizeUsd)}.`}
          />
          <MetricBlock
            label="Depth coverage"
            value={formatRatio(scored.liquidityCoverageRatio)}
            helper="Liquidity depth divided by target trade size."
            tone={riskTone(scored.liquidityRisk)}
          />
          <MetricBlock
            label="Execution delay"
            value={`${opportunity.executionDelaySeconds}s`}
            helper="Mock time to route, submit, and settle the hedge."
            tone={riskTone(scored.delayRisk)}
          />
          <div className="flex items-center justify-between gap-3 border-t border-zinc-200 py-3">
            <span className="text-sm text-zinc-500">Time sensitivity</span>
            <RiskBadge level={opportunity.timeSensitivity} />
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-zinc-200 bg-white p-5 shadow-soft">
        <div className="flex items-center gap-2">
          <ShieldAlert aria-hidden="true" className="h-5 w-5 text-red-600" />
          <h2 className="text-lg font-black text-zinc-950">Risk register</h2>
        </div>
        <div className="mt-4 divide-y divide-zinc-200">
          {[
            ["Execution risk", opportunity.executionRisk],
            ["Venue risk", opportunity.venueRisk],
            ["Settlement mismatch risk", opportunity.settlementMismatchRisk],
            ["Market rule mismatch risk", opportunity.marketRuleMismatchRisk],
            ["Operational risk", opportunity.operationalRisk],
            ["Liquidity risk", scored.liquidityRisk],
          ].map(([label, level]) => (
            <div key={label} className="flex items-center justify-between gap-3 py-3">
              <span className="text-sm text-zinc-500">{label}</span>
              <RiskBadge level={level as RiskLevel} />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-zinc-200 bg-white p-5 shadow-soft">
        <div className="flex items-center gap-2">
          <Layers aria-hidden="true" className="h-5 w-5 text-zinc-700" />
          <h2 className="text-lg font-black text-zinc-950">Rule explanation</h2>
        </div>
        <ul className="mt-4 space-y-3">
          {scored.explanation.map((reason) => (
            <li key={reason} className="flex gap-3 text-sm leading-6 text-zinc-600">
              <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-teal-600" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-5 rounded-lg border border-zinc-200 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-black text-zinc-950">Risks to check</h2>
        <ul className="mt-4 space-y-3">
          {scored.riskChecks.map((check) => (
            <li key={check} className="flex gap-3 text-sm leading-6 text-zinc-600">
              <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-blue-600" />
              <span>{check}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-5 rounded-lg border border-zinc-200 bg-zinc-950 p-5 text-white shadow-soft">
        <h2 className="text-lg font-black">Next steps</h2>
        <ul className="mt-4 space-y-3">
          {scored.nextSteps.map((step) => (
            <li key={step} className="flex gap-3 text-sm leading-6 text-zinc-200">
              <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-teal-400" />
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
