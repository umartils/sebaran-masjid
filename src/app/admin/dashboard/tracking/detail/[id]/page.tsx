export const dynamic = "force-dynamic";
import { AppFrame } from "@/components/AppFrame";
import { notFound } from 'next/navigation';
import { getTrackingMasjidById} from "@/lib/tracking";
import { ProtectedPage } from "@/components/ProtectedPage";
import { DetailProgres } from "@/components/Progres/ProgresDetail/DetailProgres";

export default async function DetilTrackingPage({params}: {params: {id: string}}) {
  
  const tracking = await getTrackingMasjidById(params.id);
  if (!tracking) notFound();

  return (
    <AppFrame>
      <ProtectedPage redirectTo="/admin/dashboard/tracking">
        <section className="admin-page">
          {/* <h1>Detail Tracking Pembangunan Masjid </h1> */}
 
          {/* <p className="subtitle">
            Ringkasan data progres pembangunan progres yang masuk ke sistem.
          </p> */}

          <DetailProgres tracking={tracking} />
        </section>
      </ProtectedPage>
    </AppFrame>
  );
}
