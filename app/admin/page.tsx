import { AppFrame } from "@/components/AppFrame";
import { conditionLabel, conditionTone } from "@/lib/format";
import { getBuildings } from "@/lib/buildings";

const badgeClass =
  "inline-flex min-h-5 items-center rounded-full px-[15px] py-1.5 text-[10px] font-medium";
const cellClass = "border-b border-line p-4 text-left";

export default async function AdminPage() {
  const buildings = await getBuildings();

  return (
    <AppFrame>
      <section className="min-h-screen p-10">
        <h1>Dashboard Admin</h1>
        <p className="mb-7 mt-1 text-base text-muted">Ringkasan data bangunan yang masuk ke sistem.</p>
        <table className="w-full border-collapse overflow-hidden rounded-lg bg-white">
          <thead>
            <tr>
              <th className={cellClass}>Nama</th>
              <th className={cellClass}>Wilayah</th>
              <th className={cellClass}>Kondisi</th>
              <th className={cellClass}>Kapasitas</th>
              <th className={cellClass}>Koordinat</th>
            </tr>
          </thead>
          <tbody>
            {buildings.map((building) => (
              <tr key={building.id}>
                <td className={cellClass}>
                  <strong>{building.name}</strong>
                  <br />
                  {building.address}
                </td>
                <td className={cellClass}>{building.regencyName}, {building.provinceName}</td>
                <td className={cellClass}>
                  <span className={`${badgeClass} ${conditionTone(building.condition)}`}>{conditionLabel(building.condition)}</span>
                </td>
                <td className={cellClass}>{building.capacity ? `${building.capacity} Jamaah` : "-"}</td>
                <td className={cellClass}>{building.latitude}, {building.longitude}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AppFrame>
  );
}

