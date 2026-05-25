export const dynamic = "force-dynamic";
import { AppFrame } from "@/components/AppFrame";
import { getBuildings } from "@/lib/buildings";
import { ProtectedPage } from "@/components/ProtectedPage";
import { BuildingTable } from "@/components/clientPage/BuildingTable";

export default async function AdminPage() {
  const buildings = await getBuildings();

  const totalRusakBerat = buildings.filter(
    (b) => b.condition === "RUSAK_BERAT"
  ).length;
  const totalPerluPerhatian = buildings.filter(
    (b) => b.condition === "RUSAK_SEDANG" || b.condition === "RUSAK_RINGAN"
  ).length;
  const totalLayak = buildings.filter((b) => b.condition === "LAYAK").length;

  return (
    <AppFrame>
      <ProtectedPage redirectTo="/admin">
        <section className="admin-page">
          <h1>Dashboard Admin</h1>
          <p className="subtitle">
            Ringkasan data bangunan yang masuk ke sistem.
          </p>

          <div className="admin-stats">
            <div className="stat-card">
              <span className="stat-number">{buildings.length}</span>
              <span className="stat-label">Total Masjid</span>
            </div>
            <div className="stat-card stat-card--danger">
              <span className="stat-number">{totalRusakBerat}</span>
              <span className="stat-label">Rusak Berat</span>
            </div>
            <div className="stat-card stat-card--warning">
              <span className="stat-number">{totalPerluPerhatian}</span>
              <span className="stat-label">Perlu Perhatian</span>
            </div>
            <div className="stat-card stat-card--success">
              <span className="stat-number">{totalLayak}</span>
              <span className="stat-label">Layak</span>
            </div>
          </div>

          {/* Search, Filter, dan Tabel — semua dihandle di client component */}
          <BuildingTable buildings={buildings} />
        </section>
      </ProtectedPage>
    </AppFrame>
  );
}
