import type { BuildingCondition } from "@/lib/types";

export function conditionLabel(condition: BuildingCondition) {
  const labels: Record<BuildingCondition, string> = {
    RUSAK_BERAT: "Rusak Berat",
    RUSAK_SEDANG: "Rusak Sedang",
    RUSAK_RINGAN: "Rusak Ringan",
    LAYAK: "Layak"
  };

  return labels[condition];
}

export function conditionTone(condition: BuildingCondition) {
  if (condition === "RUSAK_BERAT") return "badge--danger";
  if (condition === "LAYAK") return "badge--success";
  return "badge--warning";
}

