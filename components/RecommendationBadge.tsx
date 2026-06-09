import { AlertTriangle, Eye, ShieldCheck } from "lucide-react";
import { recommendationClasses } from "@/lib/format";
import type { Recommendation } from "@/lib/types";

type RecommendationBadgeProps = {
  recommendation: Recommendation;
};

export function RecommendationBadge({
  recommendation,
}: RecommendationBadgeProps) {
  const Icon =
    recommendation === "Good opportunity"
      ? ShieldCheck
      : recommendation === "Watch only"
        ? Eye
        : AlertTriangle;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${recommendationClasses(
        recommendation,
      )}`}
    >
      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      {recommendation}
    </span>
  );
}
