export const dynamic = "force-dynamic";
import { SideBar } from "@/components/SideBar";
import { ProtectedPage } from "@/components/ProtectedPage";
import { SessionGuard } from "@/components/SessionGuard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import TrackingListSection from "@/components/Tracking/ListTracking/TrackingListSection";
import TableSkeleton from "@/components/TableSkeleton";
import { redirect } from "next/navigation";

export default async function AdminPage() {

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  
  if (session?.user.role !== "Admin") return notFound();
  return (
    <SideBar>
      <SessionGuard>
        <ProtectedPage redirectTo="/admin/dashboard/tracking">
          <section className="admin-page">
            <h1>Dashboard Admin - Tracking Pembangunan</h1>

            <p className="subtitle">
            </p>
            <Suspense fallback={<TableSkeleton />}>
              <TrackingListSection  />
            </Suspense>
          </section>
        </ProtectedPage>
      </SessionGuard>
    </SideBar>
  );
}