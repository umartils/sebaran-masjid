// components/Tracking/ListTracking/TrackingListSection.tsx
// import { getAllUser } from "@/lib/user";
import { getTrackingMasjidList } from "@/lib/tracking";
import { TableTracking } from "@/components/Tracking/ListTracking/TableTracking";

export default async function UserListSection() {
  const tracking = await getTrackingMasjidList();
  if (!tracking) {
    console.log("tracking not found");
  }
  return <TableTracking tracking={tracking ?? []} />;
}