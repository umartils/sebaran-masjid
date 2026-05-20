import { AppFrame } from "@/components/AppFrame";
import { MapExperience } from "@/components/MapExperience";
import { getBuildings } from "@/lib/buildings";

export default async function HomePage() {
  const buildings = await getBuildings();

  return (
    <AppFrame>
      <MapExperience buildings={buildings} />
    </AppFrame>
  );
}

