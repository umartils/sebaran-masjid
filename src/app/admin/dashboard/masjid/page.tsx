export const dynamic = "force-dynamic";
import { SideBar } from "@/components/SideBar";
import { getMasjid, getMasjidByRelawan } from "@/lib/masjid";
import { ProtectedPage } from "@/components/ProtectedPage";
import { TablePengajuan } from "@/components/ListMasjid/TablePengajuan/TablePengajuan";
import { DashboardStats } from "@/components/ListMasjid/DashboardStats";
import { SessionGuard } from "@/components/SessionGuard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "Admin") return notFound();
  
  const masjid =
    session?.user?.role == "Admin"
      ? await getMasjid()
      : await getMasjidByRelawan(session?.user?.id as string);


  return (
    <SideBar>
      <SessionGuard>
        <ProtectedPage redirectTo="/admin/dashboard/masjid">
          <section className="admin-page">
            <h1>Dashboard Admin - Daftar Pengajuan Pembangunan</h1>

            <p className="subtitle">
              Ringkasan data pengajuan masjid yang masuk ke sistem.
            </p>

            <DashboardStats masjid={masjid} />

            <TablePengajuan masjid={masjid} />
          </section>
        </ProtectedPage>
      </SessionGuard>
    </SideBar>
  );
}
