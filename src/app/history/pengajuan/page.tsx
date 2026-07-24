import { getServerSession } from "next-auth";
import { getMasjidByRelawan } from "@/lib/masjid";
import { authOptions } from "@/lib/auth";
import { SideBar } from "@/components/SideBar";
import { ProtectedPage } from "@/components/ProtectedPage";
import { SessionGuard } from "@/components/SessionGuard";
import { Suspense } from "react";
import TableHistorySkeleton from "@/components/History/Pengajuan/TableHistorySkeleton";
import HistoryListSection from "@/components/History/Pengajuan/HistoryListSection";

export default async function HistoryPengajuanPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id ?? "";

  return (
    <SideBar>
      <SessionGuard>
        <ProtectedPage redirectTo="/history/pengajuan">
          <section className="admin-page">
            <Suspense fallback={<TableHistorySkeleton />}>
              <HistoryListSection userId = {userId} />
            </Suspense>
          </section>
        </ProtectedPage>
      </SessionGuard>
    </SideBar>
  );
}