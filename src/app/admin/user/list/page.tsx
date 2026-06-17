export const dynamic = "force-dynamic";
import { AppFrame } from "@/components/AppFrame";
import { getAllUser } from "@/lib/user";
import { ProtectedPage } from "@/components/ProtectedPage";
import { TableUser } from "@/components/User/UserList/TableUser";
import { SessionGuard } from "@/components/SessionGuard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
 
export default async function AdminPage() {
  const user = await getAllUser();
  if (!user) {
    console.log("user not found");
  }
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "Admin") return notFound();
  return (
    <AppFrame>
      <SessionGuard>
        <ProtectedPage redirectTo="/admin/user/list">
          <section className="admin-page">
            <h1>Dashboard Admin - Daftar User Se-IMaN</h1>

            <TableUser user={user} />
          </section>
        </ProtectedPage>
      </SessionGuard>
    </AppFrame>
  );
}