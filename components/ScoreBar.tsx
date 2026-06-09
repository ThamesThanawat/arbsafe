type ScoreBarProps = {
  score: number;
};

export function ScoreBar({ score }: ScoreBarProps) {
  const tone =
    score >= 75 ? "bg-emerald-500" : score >= 45 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm font-semibold text-zinc-900">ArbSafe score</span>
        <span className="text-2xl font-black tabular-nums text-zinc-950">
          {score}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-zinc-200">
        <div
          className={`h-full rounded-full ${tone}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
