export const dynamic = "force-dynamic";
import { AppFrame } from "@/components/AppFrame";
import { getTrackingMasjidList } from "@/lib/tracking";
import { ProtectedPage } from "@/components/ProtectedPage";
import { TablePengajuan } from "@/components/Progres/ListProgres/TableProgres";
// import { DashboardStats } from "@/components/ListMasjid/DashboardStats";

export default async function AdminPage() {
  const masjid = await getTrackingMasjidList();

  return (
    <AppFrame>
      <ProtectedPage redirectTo="/admin/dashboard/tracking">
        <section className="admin-page">
          <h1>Dashboard Admin - Tracking Pembangunan</h1>

          <p className="subtitle">
            Ringkasan data progres pembangunan masjid yang masuk ke sistem.
          </p>

          <TablePengajuan progres={masjid} />
        </section>
      </ProtectedPage>
    </AppFrame>
  );
}