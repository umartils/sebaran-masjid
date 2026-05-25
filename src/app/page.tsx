import { AppFrame } from "@/components/AppFrame";
import { MapExperience } from "@/components/MapExperience";
import { getBuildings } from "@/lib/buildings";
import { getMasjidMN } from "@/lib/masjid-mn";
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const buildingsRenovasi = await getBuildings();
  const buildingsDibangun = await getMasjidMN();

  return (
    <AppFrame>
      <MapExperience
        buildingsRenovasi={buildingsRenovasi}
        buildingsDibangun={buildingsDibangun}
      />
    </AppFrame>
  );
}

