import { AppFrame } from "@/components/AppFrame";
import { notFound } from 'next/navigation';
import {
  getTrackingMasjidLogById,
  getMasjidIdByTrackingId,
} from "@/lib/tracking";
import { EditProgresLog } from "@/components/Progres/EditProgres/EditProgres";
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
    <AppFrame>
      <ProtectedPage redirectTo="/input/pengajuan">
        <section className="form-page">
          <EditProgresLog log={log} from={from} masjid={masjid} />
        </section>
      </ProtectedPage>
    </AppFrame>
  );
}