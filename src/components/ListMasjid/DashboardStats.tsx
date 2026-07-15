import { Masjid } from "@/lib/types";
import { StatCard } from "./StatCard";

interface DashboardStatsProps {
  masjid: Masjid[];
}

export function DashboardStats({
  masjid,
}: DashboardStatsProps) {
  const masjidClean = masjid.filter((b) => b.statusPengajuan !== "DELETED");
  const totalRejected = masjidClean.filter(
    (b) => b.statusPengajuan === "REJECTED"
  ).length;

  const totalPending = masjidClean.filter(
    (b) => b.statusPengajuan === "PENDING"
  ).length;

  const totalApproved = masjidClean.filter(
    (b) => b.statusPengajuan === "APPROVED"
  ).length;

  const totalAOnAir = masjidClean.filter(
    (b) => b.statusPengajuan === "ON_AIR"
  ).length;

  return (
    <div className="admin-stats">
      <StatCard 
        value={totalAOnAir} 
        label="ON AIR" 
        variant="stat-card--info"
      />

      <StatCard
        value={totalRejected}
        label="REJECTED"
        variant="stat-card--danger"
      />

      <StatCard
        value={totalPending}
        label="PENDING"
        variant="stat-card--warning"
      />

      <StatCard
        value={totalApproved}
        label="APPROVED"
        variant="stat-card--success"
      />
    </div>
  );
}