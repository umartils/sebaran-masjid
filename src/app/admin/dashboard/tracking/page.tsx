export const dynamic = "force-dynamic";
import { AppFrame } from "@/components/AppFrame";
import { getTrackingMasjidList } from "@/lib/tracking";
import { ProtectedPage } from "@/components/ProtectedPage";
import { TablePengajuan } from "@/components/Progres/ListProgres/TableProgres";
import { SessionGuard } from "@/components/SessionGuard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";

export default async function AdminPage() {
  const masjid = await getTrackingMasjidList();
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "Admin") return notFound();
  return (
    <AppFrame>
      <SessionGuard>
        <ProtectedPage redirectTo="/admin/dashboard/tracking">
          <section className="admin-page">
            <h1>Dashboard Admin - Tracking Pembangunan</h1>

            <p className="subtitle">
              Ringkasan data progres pembangunan masjid yang masuk ke sistem.
            </p>

            <TablePengajuan progres={masjid} />
          </section>
        </ProtectedPage>
      </SessionGuard>
    </AppFrame>
  );
}