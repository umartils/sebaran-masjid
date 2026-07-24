export const dynamic = "force-dynamic";
import { SideBar } from "@/components/SideBar";
import { Suspense } from "react";
import { ProtectedPage } from "@/components/ProtectedPage";
import { SessionGuard } from "@/components/SessionGuard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import PengajuanListSection from "@/components/ListMasjid/TablePengajuan/PengajuanListSection";
import TablePengajuanSkeleton from "@/components/ListMasjid/TablePengajuan/TablePengajuanSkeleton";
import { useSession } from "next-auth/react";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "Admin") return notFound();

  const role = session.user.role ?? "";
  const userId = session.user.id ?? "";


  return (
    <SideBar>
      <SessionGuard>
        <ProtectedPage redirectTo="/admin/dashboard/masjid">
          <section className="admin-page">
            <h1>Dashboard Admin - Daftar Pengajuan Pembangunan</h1>

            <p className="subtitle">
            </p>

            <Suspense fallback={<TablePengajuanSkeleton />}>
              <PengajuanListSection role={role} userId={userId}/>
            </Suspense>

          </section>
        </ProtectedPage>
      </SessionGuard>
    </SideBar>
  );
}
