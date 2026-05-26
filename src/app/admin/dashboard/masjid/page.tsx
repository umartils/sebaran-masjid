export const dynamic = "force-dynamic";
import { AppFrame } from "@/components/AppFrame";
import { getMasjid } from "@/lib/masjid";
import { ProtectedPage } from "@/components/ProtectedPage";
import { BuildingTable } from "@/components/ListMasjid/BuildingTable";
import { DashboardStats } from "@/components/ListMasjid/DashboardStats";

export default async function AdminPage() {
  const masjid = await getMasjid();

  return (
    <AppFrame>
      <ProtectedPage redirectTo="/admin">
        <section className="admin-page">
          <h1>Dashboard Admin</h1>

          <p className="subtitle">
            Ringkasan data bangunan yang masuk ke sistem.
          </p>

          <DashboardStats masjid={masjid} />

          <BuildingTable buildings={masjid} />
        </section>
      </ProtectedPage>
    </AppFrame>
  );
}
