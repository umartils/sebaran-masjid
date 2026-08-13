import { SideBar } from "@/components/SideBar";
import { Suspense } from "react";
import TableSkeleton from "@/components/TableSkeleton";
import MasjidDetailListSection from '@/components/MasjidDetail/MasjidDetailListSection';
 
export default async function BuildingDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { from?: string };
}) {
  const id = params.id;
  const callBackUrl = `/masjid/detail/${id}`;
  const from = searchParams.from || "/";
  console.log("id", id);
  return (
    <SideBar callBackUrl={callBackUrl}>
      <section className="form-page">
        <Suspense fallback={<TableSkeleton />}>
          <MasjidDetailListSection id={id} from={from} />
        </Suspense>
      </section>
    </SideBar>
  );
}