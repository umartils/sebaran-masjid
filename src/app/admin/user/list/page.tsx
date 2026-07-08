export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { SideBar } from "@/components/SideBar";
import { getAllUser } from "@/lib/user";
import { ProtectedPage } from "@/components/ProtectedPage";
import { TableUser } from "@/components/User/UserList/TableUser";
import { SessionGuard } from "@/components/SessionGuard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import UserListSection from "@/components/User/UserList/UserListSection";
import TableUserSkeleton from "@/components/User/UserList/TableUserSkeleton";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "Admin") return notFound();

  // const user = await getAllUser();
  // if (!user) {
  //   console.log("user not found");
  // }
  return (
    <SideBar>
      <SessionGuard>
        <ProtectedPage redirectTo="/admin/user/list">
          <section className="admin-page">
            <h1>Dashboard Admin - Daftar User Se-IMaN</h1>

            <Suspense fallback={<TableUserSkeleton />}>
              <UserListSection />
            </Suspense>
          </section>
        </ProtectedPage>
      </SessionGuard>
    </SideBar>
  );
}