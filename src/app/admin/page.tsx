import { AppFrame } from "@/components/AppFrame";
import { conditionLabel, conditionTone } from "@/lib/format";
import { getBuildings } from "@/lib/buildings";
import { ProtectedPage } from "@/components/ProtectedPage";

export default async function AdminPage() {
  const buildings = await getBuildings();

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
              <span className="stat-number">
                {buildings.filter((b) => b.condition === "RUSAK_BERAT").length}
              </span>
              <span className="stat-label">Rusak Berat</span>
            </div>
            <div className="stat-card stat-card--warning">
              <span className="stat-number">
                {
                  buildings.filter(
                    (b) =>
                      b.condition === "RUSAK_SEDANG" ||
                      b.condition === "RUSAK_RINGAN"
                  ).length
                }
              </span>
              <span className="stat-label">Perlu Perhatian</span>
            </div>
            <div className="stat-card stat-card--success">
              <span className="stat-number">
                {buildings.filter((b) => b.condition === "LAYAK").length}
              </span>
              <span className="stat-label">Layak</span>
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Wilayah</th>
                  <th>Kondisi</th>
                  <th>Kapasitas</th>
                  <th>Koordinat</th>
                </tr>
              </thead>
              <tbody>
                {buildings.map((building) => (
                  <tr key={building.id}>
                    <td>
                      <strong>{building.name}</strong>
                      <br />
                      <span className="table-address">{building.address}</span>
                    </td>
                    <td>
                      {building.regencyName},<br />
                      <span className="table-province">
                        {building.provinceName}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${conditionTone(building.condition)}`}
                      >
                        {conditionLabel(building.condition)}
                      </span>
                    </td>
                    <td>
                      {building.capacity ? `${building.capacity} Jamaah` : "-"}
                    </td>
                    <td className="table-coords">
                      {building.latitude.toFixed(4)},{" "}
                      {building.longitude.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </ProtectedPage>
    </AppFrame>
  );
}