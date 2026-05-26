import type { KondisiMasjid, StatusMasjid } from "@/lib/types";

export function conditionLabel(condition: KondisiMasjid) {
  const labels: Record<KondisiMasjid, string> = {
    RUSAK_BERAT: "Rusak Berat",
    RUSAK_SEDANG: "Rusak Sedang",
    RUSAK_RINGAN: "Rusak Ringan",
    LAYAK: "Layak",
  };

  return labels[condition];
}

export function statusLabel(status: StatusMasjid) {
  const labels: Record<StatusMasjid, string> = {
    APPROVED: "Disetujui",
    PENDING: "Menunggu",
    REJECTED: "Ditolak",
    DELETED: "Dihapus",
  };

  return labels[status];
}

export function conditionTone(condition: KondisiMasjid) {
  if (condition === "RUSAK_BERAT") return "badge--danger";
  if (condition === "LAYAK") return "badge--success";
  return "badge--warning";
}

export function statusTone(status: StatusMasjid) {
  if (status === "APPROVED") return "badge--success";
  if (status === "REJECTED") return "badge--danger";
  return "badge--warning";
}
