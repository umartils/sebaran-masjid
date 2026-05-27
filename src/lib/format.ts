import type { KategoriMasjid, KondisiMasjid, StatusMasjid } from "@/lib/types";

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

export function kategoriLabel(kategori: KategoriMasjid) {
  const labels: Record<KategoriMasjid, string> = {
    Pelosok_Pedalaman: "Pelosok Pedalaman",
    Kampung_Mualaf: "Kampung Mualaf",
    Muslim_Minoritas: "Muslim Minoritas",
    Terdampak_Bencana: "Terdampak Bencana",
  };

  return labels[kategori];
}

export function conditionTone(condition: KondisiMasjid) {
  if (condition === "RUSAK_BERAT") return "badge--danger";
  if (condition === "LAYAK") return "badge--success";
  return "badge--warning";
}

export function kategoriTone(category: KategoriMasjid) {
  if (category == "Pelosok_Pedalaman") return "badge--success";
  if (category == "Kampung_Mualaf") return "badge--warning";
  if (category == "Muslim_Minoritas") return "badge--info";
  return "badge--brand-light";
}

export function statusTone(status: StatusMasjid) {
  if (status === "APPROVED") return "badge--success";
  if (status === "REJECTED") return "badge--danger";
  return "badge--warning";
}
