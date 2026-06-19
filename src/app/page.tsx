import { MapExperience } from "@/components/SebaranMasjid/MapExperience";
import { getMapMasjid } from "@/lib/masjid";
import { getMapMasjidMN } from "@/lib/masjid-mn";
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [buildingsRenovasi, buildingsDibangun] = await Promise.all([
    getMapMasjid(),
    getMapMasjidMN(),
  ]);

  return (
    <MapExperience
      buildingsRenovasi={buildingsRenovasi}
      buildingsDibangun={buildingsDibangun}
    />
  );
}
