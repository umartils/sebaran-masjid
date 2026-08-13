import { getMasjidById } from '@/lib/masjid';
import { notFound } from 'next/navigation';
import MasjidDetail from '@/components/MasjidDetail/MasjidDetail';

type Props = {
  id: string;
  from: string;
};

export default async function MasjidDetailListSection({ id, from }: Props) {
  const masjid = await getMasjidById(id);
  if (!masjid) return notFound();

  return <MasjidDetail masjid={masjid} from={from} />;
}