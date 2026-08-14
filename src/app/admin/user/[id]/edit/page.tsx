import { SideBar } from "@/components/SideBar";
import { notFound } from "next/navigation";
import { getUserById } from "@/lib/user";
import { EditUserForm } from "@/components/User/UserInputForm/EditUserForm";
import { ProtectedPage } from "@/components/ProtectedPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MasjidEditPage({
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
  
  const user = await getUserById(params.id);
  if (!user) notFound();
  console.log("user id: ", user.id);
  const from = searchParams.from || "/";
  return (
    <SideBar>
      <ProtectedPage redirectTo="/admin/user/list">
        <section className="form-page">
          <EditUserForm user={user} from={from} />
        </section>
      </ProtectedPage>
    </SideBar>
  );
}
