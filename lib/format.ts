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
  if (condition === "RUSAK_BERAT") return "bg-red-100 text-danger";
  if (condition === "LAYAK") return "bg-green-100 text-success";
  return "bg-amber-100 text-warning";
}

