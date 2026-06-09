type MetricBlockProps = {
  label: string;
  value: string;
  helper?: string;
  tone?: "neutral" | "positive" | "warning" | "danger";
};

const toneClasses = {
  neutral: "text-zinc-950",
  positive: "text-emerald-700",
  warning: "text-amber-700",
  danger: "text-red-700",
};

export function MetricBlock({
  label,
  value,
  helper,
  tone = "neutral",
}: MetricBlockProps) {
  return (
    <div className="border-t border-zinc-200 py-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-zinc-500">{label}</span>
        <span className={`text-base font-bold tabular-nums ${toneClasses[tone]}`}>
          {value}
        </span>
      </div>
      {helper ? <p className="mt-1 text-xs text-zinc-500">{helper}</p> : null}
    </div>
  );
}
