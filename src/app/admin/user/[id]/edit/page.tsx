import { AppFrame } from "@/components/AppFrame";
import { notFound } from 'next/navigation';
import { getUserById } from "@/lib/user";
import { EditUserForm } from "@/components/User/UserInputForm/EditUserForm";
import { ProtectedPage } from "@/components/ProtectedPage";

export default async function MasjidEditPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { from?: string };
}) {
  const user = await getUserById(params.id);
  if (!user) notFound();
  console.log("user id: ", user.id);
  const from = searchParams.from || "/";
  return (
    <AppFrame>
      <ProtectedPage redirectTo="/admin/user/list">
        <section className="form-page">
          <EditUserForm user={user} from={from} />
        </section>
      </ProtectedPage>
    </AppFrame>
  );
} 