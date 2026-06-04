import { getMasjidById } from '@/lib/masjid';
import { notFound } from 'next/navigation';
import MasjidDetail from '@/components/MasjidDetail/MasjidDetail';
import { AppFrame } from '@/components/AppFrame';

export default async function BuildingDetailPage({
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
      <section className="form-page">
        <MasjidDetail masjid={masjid} from={from} />
      </section>
    </AppFrame>
  );
}