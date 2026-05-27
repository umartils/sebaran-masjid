import { AppFrame } from "@/components/AppFrame";
import { MapExperience } from "@/components/SebaranMasjid/MapExperience";
import { getMasjid } from "@/lib/masjid";
import { getMasjidMN } from "@/lib/masjid-mn";
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const buildingsRenovasi = await getMasjid();
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

