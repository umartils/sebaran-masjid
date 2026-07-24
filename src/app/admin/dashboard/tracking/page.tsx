export const dynamic = "force-dynamic";
import { SideBar } from "@/components/SideBar";
import { ProtectedPage } from "@/components/ProtectedPage";
import { SessionGuard } from "@/components/SessionGuard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import TrackingListSection from "@/components/Tracking/ListTracking/TrackingListSection";
import TableTrackingSkeleton from "@/components/Tracking/ListTracking/TableTrackingSkeleton";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "Admin") return notFound();
  return (
    <SideBar>
      <SessionGuard>
        <ProtectedPage redirectTo="/admin/dashboard/tracking">
          <section className="admin-page">
            <h1>Dashboard Admin - Tracking Pembangunan</h1>

            <p className="subtitle">
            </p>
            <Suspense fallback={<TableTrackingSkeleton />}>
              <TrackingListSection  />
            </Suspense>
          </section>
        </ProtectedPage>
      </SessionGuard>
    </SideBar>
  );
}