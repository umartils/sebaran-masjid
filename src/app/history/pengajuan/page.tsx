import { getServerSession } from "next-auth";
import { getMasjidByRelawan } from "@/lib/masjid";
import { authOptions } from "@/lib/auth";
import { SideBar } from "@/components/SideBar";
import { ProtectedPage } from "@/components/ProtectedPage";
import { SessionGuard } from "@/components/SessionGuard";
import { Suspense } from "react";
import TableSkeleton from "@/components/TableSkeleton";
import HistoryListSection from "@/components/History/Pengajuan/HistoryListSection";
import { redirect } from "next/navigation";

export default async function HistoryPengajuanPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const userId = session?.user.id ?? "";

  return (
    <SideBar>
      <SessionGuard>
        <ProtectedPage redirectTo="/history/pengajuan">
          <section className="admin-page">
            <Suspense fallback={<TableSkeleton />}>
              <h1>Riwayat Pengajuan Pembangunan</h1>
              <p className="subtitle"></p>
              <HistoryListSection userId = {userId} />
            </Suspense>
          </section>
        </ProtectedPage>
      </SessionGuard>
    </SideBar>
  );
}