import { riskClasses } from "@/lib/format";
import type { RiskLevel } from "@/lib/types";

type RiskBadgeProps = {
  level: RiskLevel;
};

export function RiskBadge({ level }: RiskBadgeProps) {
  return (
    <span
      className={`inline-flex min-w-16 justify-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${riskClasses(
        level,
      )}`}
    >
      {level}
    </span>
  );
}
