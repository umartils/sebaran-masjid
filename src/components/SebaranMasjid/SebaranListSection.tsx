import { MapExperience } from "@/components/SebaranMasjid/MapExperience";
import { getMapMasjid } from "@/lib/masjid";
import { getMapMasjidMN } from "@/lib/masjid-mn";
import { MapMasjid, MapMasjidMNBaru, } from "@/lib/types";

export default async function SebaranListSection() {
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