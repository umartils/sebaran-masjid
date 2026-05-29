import { Masjid } from "@/lib/types";
import { StatCard } from "./StatCard";

interface DashboardStatsProps {
  masjid: Masjid[];
}

export function DashboardStats({
  masjid,
}: DashboardStatsProps) {
  const masjidClean = masjid.filter((b) => b.statusPengajuan !== "DELETED");
  const totalRusakBerat = masjidClean.filter(
    (b) => b.kondisi === "RUSAK_BERAT"
  ).length;

  const totalPerluPerhatian = masjidClean.filter(
    (b) => b.kondisi === "RUSAK_SEDANG" || b.kondisi === "RUSAK_RINGAN"
  ).length;

  const totalLayak = masjidClean.filter((b) => b.kondisi === "LAYAK").length;

  return (
    <div className="admin-stats">
      <StatCard value={masjidClean.length} label="Total Masjid" />

      <StatCard
        value={totalRusakBerat}
        label="Rusak Berat"
        variant="stat-card--danger"
      />

      <StatCard
        value={totalPerluPerhatian}
        label="Perlu Perhatian"
        variant="stat-card--warning"
      />

      <StatCard value={totalLayak} label="Layak" variant="stat-card--success" />
    </div>
  );
}