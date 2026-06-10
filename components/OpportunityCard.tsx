import Link from "next/link";
import { ArrowRight, Clock3, Route } from "lucide-react";
import {
  formatBps,
  formatPercentFromBps,
  formatRatio,
  formatUsd,
} from "@/lib/format";
import { scoreOpportunity } from "@/lib/scoring";
import type { ArbitrageOpportunity } from "@/lib/types";
import { RecommendationBadge } from "./RecommendationBadge";
import { ScoreBar } from "./ScoreBar";

type OpportunityCardProps = {
  opportunity: ArbitrageOpportunity;
};

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const scored = scoreOpportunity(opportunity);
  const netTone = scored.netOpportunityBps >= 0 ? "text-emerald-700" : "text-red-700";

  return (
    <Link
      href={`/opportunities/${opportunity.id}`}
      className="group block rounded-lg border border-zinc-200 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-zinc-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            Kalshi vs Polymarket
          </p>
          <h2 className="mt-2 text-lg font-black leading-tight text-zinc-950">
            {opportunity.title}
          </h2>
        </div>
        <ArrowRight
          aria-hidden="true"
          className="mt-1 h-5 w-5 flex-none text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-zinc-700"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <RecommendationBadge recommendation={scored.recommendation} />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700">
          <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
          {opportunity.updatedAgo}
        </span>
      </div>

      {opportunity.demoCallout ? (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold leading-5 text-red-700">
          {opportunity.demoCallout}
        </p>
      ) : null}

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-500">Gross spread</p>
          <p className="mt-1 text-xl font-black tabular-nums text-zinc-950">
            {formatPercentFromBps(opportunity.grossSpreadBps)}
          </p>
          <p className="text-xs font-semibold tabular-nums text-zinc-500">
            {formatBps(opportunity.grossSpreadBps)}
          </p>
        </div>
        <div className="rounded-lg bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-500">Net estimate</p>
          <p className={`mt-1 text-xl font-black tabular-nums ${netTone}`}>
            {formatPercentFromBps(scored.netOpportunityBps)}
          </p>
          <p className="text-xs font-semibold tabular-nums text-zinc-500">
            {formatBps(scored.netOpportunityBps)}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <ScoreBar score={scored.arbSafeScore} />
      </div>

      <p className="mt-4 text-sm leading-6 text-zinc-600">
        {opportunity.whyScore}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-zinc-200 pt-4 text-xs">
        <div>
          <p className="font-semibold text-zinc-500">Liquidity</p>
          <p className="mt-1 font-bold text-zinc-950">
            {formatUsd(opportunity.liquidityDepthUsd)}
          </p>
        </div>
        <div>
          <p className="font-semibold text-zinc-500">Depth cover</p>
          <p className="mt-1 font-bold text-zinc-950">
            {formatRatio(scored.liquidityCoverageRatio)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 border-t border-zinc-200 pt-4">
        <Route aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-blue-600" />
        <span className="min-w-0 break-words text-sm font-semibold leading-5 text-zinc-700">
          {opportunity.venues.buy} to {opportunity.venues.sell}
        </span>
      </div>
    </Link>
  );
}
