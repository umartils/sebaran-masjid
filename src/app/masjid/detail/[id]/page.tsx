import { getMasjidById } from '@/lib/masjid';
import { notFound } from 'next/navigation';
import MasjidDetail from '@/components/MasjidDetail/MasjidDetail';
import { SideBar } from "@/components/SideBar";
 
export default async function BuildingDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { from?: string };
}) {
  const masjid = await getMasjidById(params.id);
  const callBackUrl = `/masjid/detail/${params.id}`;
  if (!masjid) notFound();
  const from = searchParams.from || "/";
  return (
    <SideBar callBackUrl={callBackUrl}>
      <section className="form-page">
        <MasjidDetail masjid={masjid} from={from} />
      </section>
    </SideBar>
  );
}