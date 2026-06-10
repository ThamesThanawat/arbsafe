import type { ScoreFactor } from "@/lib/types";

type ScoreFactorBreakdownProps = {
  factors: ScoreFactor[];
};

export function ScoreFactorBreakdown({ factors }: ScoreFactorBreakdownProps) {
  return (
    <div className="space-y-3">
      {factors.map((factor) => (
        <div key={factor.label} className="rounded-lg border border-zinc-200 p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-black text-zinc-950">{factor.label}</p>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-bold text-zinc-600">
                  {factor.weight}%
                </span>
              </div>
              <p className="mt-1 text-xs leading-5 text-zinc-500">
                {factor.helper}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-lg font-black tabular-nums text-zinc-950">
                {factor.contribution}
              </p>
              <p className="text-[11px] font-semibold text-zinc-500">points</p>
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-teal-500"
              style={{ width: `${factor.factorScore}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
