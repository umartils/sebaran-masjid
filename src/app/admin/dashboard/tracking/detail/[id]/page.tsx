export const dynamic = "force-dynamic";
import { SideBar } from "@/components/SideBar";
import { notFound } from "next/navigation";
import { getTrackingMasjidById } from "@/lib/tracking";
import { ProtectedPage } from "@/components/ProtectedPage";
import { DetailProgres } from "@/components/Tracking/ProgresDetail/DetailProgres";
import { SessionGuard } from "@/components/SessionGuard";

export default async function DetilTrackingPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { from?: string };
}) {
  const tracking = await getTrackingMasjidById(params.id);
  if (!tracking) notFound();
  const from = searchParams.from || "/";

  return (
    <SideBar>
      <SessionGuard>
        <ProtectedPage redirectTo="/admin/dashboard/tracking">
          <section className="admin-page">
            {/* <h1>Detail Tracking Pembangunan Masjid </h1> */}

            {/* <p className="subtitle">
              Ringkasan data progres pembangunan progres yang masuk ke sistem.
            </p> */}

            <DetailProgres tracking={tracking} from={from} />
          </section>
        </ProtectedPage>
      </SessionGuard>
    </SideBar>
  );
}
