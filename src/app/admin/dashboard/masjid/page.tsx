export const dynamic = "force-dynamic";
import { AppFrame } from "@/components/AppFrame";
import { getMasjid } from "@/lib/masjid";
import { ProtectedPage } from "@/components/ProtectedPage";
import { TablePengajuan } from "@/components/ListMasjid/TablePengajuan/TablePengajuan";
import { DashboardStats } from "@/components/ListMasjid/DashboardStats";
import { SessionGuard } from "@/components/SessionGuard";

export default async function AdminPage() {
  const masjid = await getMasjid();

  return (
    <AppFrame>
      <SessionGuard>
        <ProtectedPage redirectTo="/admin">
          <section className="admin-page">
            <h1>Dashboard Admin - Daftar Pengajuan Pembangunan</h1>

            <p className="subtitle">
              Ringkasan data bangunan yang masuk ke sistem.
            </p>

            <DashboardStats masjid={masjid} />

            <TablePengajuan masjid={masjid} />
          </section>
        </ProtectedPage>
      </SessionGuard>
    </AppFrame>
  );
}
