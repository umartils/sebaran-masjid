import { AppFrame } from "@/components/AppFrame";
import { conditionLabel, conditionTone } from "@/lib/format";
import { getBuildings } from "@/lib/buildings";

export default async function AdminPage() {
  const buildings = await getBuildings();

  return (
    <AppFrame>
      <section className="admin-page">
        <h1>Dashboard Admin</h1>
        <p className="subtitle">Ringkasan data bangunan yang masuk ke sistem.</p>
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
                  {building.address}
                </td>
                <td>{building.regencyName}, {building.provinceName}</td>
                <td>
                  <span className={`badge ${conditionTone(building.condition)}`}>{conditionLabel(building.condition)}</span>
                </td>
                <td>{building.capacity ? `${building.capacity} Jamaah` : "-"}</td>
                <td>{building.latitude}, {building.longitude}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AppFrame>
  );
}

