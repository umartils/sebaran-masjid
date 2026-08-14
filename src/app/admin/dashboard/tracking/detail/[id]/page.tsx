export const dynamic = "force-dynamic";
import { SideBar } from "@/components/SideBar";
import { notFound } from "next/navigation";
import { getTrackingMasjidById } from "@/lib/tracking";
import { ProtectedPage } from "@/components/ProtectedPage";
import DetailListSection from "@/components/Tracking/ProgresDetail/DetailListSection";
import { SessionGuard } from "@/components/SessionGuard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import TableSkeleton from "@/components/TableSkeleton";

export default async function DetilTrackingPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { from?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  if (session?.user.role !== "Admin") return notFound();

  const id = params.id;
  if (!id) {
    notFound();
  }
  const from = searchParams.from || "/";

  const tracking = await getTrackingMasjidById(params.id);
  if (!tracking) notFound();

  return (
    <SideBar>
      <SessionGuard>
        <ProtectedPage redirectTo="/admin/dashboard/tracking">
          <section className="admin-page">
            <Suspense fallback={<TableSkeleton />}>
              <DetailListSection id={id} from={from} />
            </Suspense>
          </section>
        </ProtectedPage>
      </SessionGuard>
    </SideBar>
  );
}
