import { formatBps, formatPercentFromBps } from "@/lib/format";
import type { GrossToNetLine } from "@/lib/types";

type GrossToNetRevealProps = {
  lines: GrossToNetLine[];
};

export function GrossToNetReveal({ lines }: GrossToNetRevealProps) {
  return (
    <div className="rounded-lg bg-zinc-950 p-3.5 text-white">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-300">
            Gross to net
          </p>
          <h2 className="mt-1 text-lg font-black">Is the spread still real?</h2>
        </div>
      </div>

      <div className="mt-4 divide-y divide-white/10">
        {lines.map((line) => {
          const isNet = line.kind === "net";
          const isDeduction = line.kind === "deduction";
          const valueTone = isNet
            ? line.bps >= 0
              ? "text-emerald-300"
              : "text-red-300"
            : isDeduction
              ? "text-red-200"
              : "text-white";

          return (
            <div
              key={line.label}
              className={`flex items-center justify-between gap-3 py-2 ${
                isNet ? "mt-1 border-t-2 border-white/30 pt-3" : ""
              }`}
            >
              <span
                className={`min-w-0 text-sm ${
                  isNet ? "font-black text-white" : "font-medium text-zinc-300"
                }`}
              >
                {isDeduction ? "- " : isNet ? "= " : ""}
                {line.label}
              </span>
              <span className="flex shrink-0 flex-col items-end">
                <span className={`text-base font-black tabular-nums ${valueTone}`}>
                  {formatPercentFromBps(line.bps)}
                </span>
                <span className="text-xs font-semibold tabular-nums text-zinc-400">
                  {formatBps(line.bps)}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
