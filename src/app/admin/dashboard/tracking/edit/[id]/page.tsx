import { SideBar } from "@/components/SideBar";
import { notFound } from "next/navigation";
import {
  getTrackingMasjidLogById,
  getMasjidIdByTrackingId,
} from "@/lib/tracking";
import { EditProgresLog } from "@/components/Tracking/EditProgres/EditProgres";
import { ProtectedPage } from "@/components/ProtectedPage";

export default async function MasjidEditPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { from?: string };
}) {
  const log = await getTrackingMasjidLogById(params.id);
  const trackingId = log?.trackingId;
  const masjid = await getMasjidIdByTrackingId(trackingId || "");
  if (!log || !masjid) notFound();
  const from = searchParams.from || "/";
  return (
    <SideBar>
      <ProtectedPage redirectTo="/input/pengajuan">
        <section className="form-page">
          <EditProgresLog log={log} from={from} masjid={masjid} />
        </section>
      </ProtectedPage>
    </SideBar>
  );
}
