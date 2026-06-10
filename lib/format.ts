import type { Recommendation, RiskLevel } from "./types";

export function formatBps(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(0)} bps`;
}

export function formatPercentFromBps(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${(value / 100).toFixed(2)}%`;
}

export function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatRatio(value: number): string {
  return `${value.toFixed(1)}x`;
}

export function recommendationClasses(recommendation: Recommendation): string {
  switch (recommendation) {
    case "Good opportunity":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "Watch only":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "Avoid":
      return "border-red-200 bg-red-50 text-red-700";
  }
}

export function riskClasses(level: RiskLevel): string {
  switch (level) {
    case "low":
      return "bg-emerald-50 text-emerald-700";
    case "medium":
      return "bg-amber-50 text-amber-700";
    case "high":
      return "bg-red-50 text-red-700";
  }
}
