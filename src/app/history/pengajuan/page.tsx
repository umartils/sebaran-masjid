import { getServerSession } from "next-auth";
import { getMasjidByRelawan } from "@/lib/masjid";
import { authOptions } from "@/lib/auth";
import { signOut } from "next-auth/react";
import { SideBar } from "@/components/SideBar";
import { ProtectedPage } from "@/components/ProtectedPage";
import { SessionGuard } from "@/components/SessionGuard";
import { HistoryPengajuan } from "@/components/History/Pengajuan/HistoryPengajuan";

export default async function HistoryPengajuanPage() {
  const session = await getServerSession(authOptions);
  const masjid = await getMasjidByRelawan(session?.user?.id as string);

  return (
    <SideBar>
      <SessionGuard>
        <ProtectedPage redirectTo="/history/pengajuan">
          <section className="admin-page">
            <HistoryPengajuan masjid={masjid} />
          </section>
        </ProtectedPage>
      </SessionGuard>
    </SideBar>
  );
}