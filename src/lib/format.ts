import type { BuildingCondition, BuildingStatus } from "@/lib/types";

export function conditionLabel(condition: BuildingCondition) {
  const labels: Record<BuildingCondition, string> = {
    RUSAK_BERAT: "Rusak Berat",
    RUSAK_SEDANG: "Rusak Sedang",
    RUSAK_RINGAN: "Rusak Ringan",
    LAYAK: "Layak",
  };

  return labels[condition];
}

export function statusLabel(status: BuildingStatus) {
  const labels: Record<BuildingStatus, string> = {
    APPROVED: "Disetujui",
    PENDING: "Menunggu",
    REJECTED: "Ditolak",
    DELETED: "Dihapus",
  };

  return labels[status];
}

export function conditionTone(condition: BuildingCondition) {
  if (condition === "RUSAK_BERAT") return "badge--danger";
  if (condition === "LAYAK") return "badge--success";
  return "badge--warning";
}

export function statusTone(status: BuildingStatus) {
  if (status === "APPROVED") return "badge--success";
  if (status === "REJECTED") return "badge--danger";
  return "badge--warning";
}
