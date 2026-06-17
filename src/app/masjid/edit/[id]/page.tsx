import { AppFrame } from "@/components/AppFrame";
import { notFound } from 'next/navigation';
import { getMasjidById } from '@/lib/masjid';
import { FormEditPengajuan } from "@/components/form/FormPengajuan/FormEditPengajuan";
import { ProtectedPage } from "@/components/ProtectedPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function MasjidEditPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { from?: string };
}) {
  const session = await getServerSession(authOptions);
  const masjid = await getMasjidById(params.id);

  if (!masjid) notFound();
  const from = searchParams.from || "/";

  if (masjid.userId !== session?.user?.id) return notFound();

  return (
    <AppFrame>
      <ProtectedPage redirectTo="/admin/dashboard/pengajuan">
        <section className="form-page">
          <FormEditPengajuan masjid={masjid} from={from} />
        </section>
      </ProtectedPage>
    </AppFrame>
  );
}