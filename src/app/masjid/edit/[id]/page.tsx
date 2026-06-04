import { AppFrame } from "@/components/AppFrame";
import { notFound } from 'next/navigation';
import { getMasjidById } from '@/lib/masjid';
import { FormEditPengajuan } from "@/components/form/FormPengajuan/FormEditPengajuan";
import { ProtectedPage } from "@/components/ProtectedPage";

export default async function MasjidEditPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { from?: string };
}) {
  const masjid = await getMasjidById(params.id);
  if (!masjid) notFound();
  const from = searchParams.from || "/";
  return (
    <AppFrame>
      <ProtectedPage redirectTo="/input/pengajuan">
        <section className="form-page">
          <FormEditPengajuan masjid={masjid} from={from} />
        </section>
      </ProtectedPage>
    </AppFrame>
  );
}