import { SideBar } from "@/components/SideBar";
import { ProtectedPage } from "@/components/ProtectedPage";
import { getTrackingMasjidById } from "@/lib/tracking";
import { FormTambahLog } from "@/components/Tracking/TambahLog/FormTambahLog";
import { notFound } from "next/navigation";
import { SessionGuard } from "@/components/SessionGuard";

export default async function Page({ 
  params, 
  searchParams 
}: { 
  params: { id: string },
  searchParams: { from: string } 
}) {
  const tracking = await getTrackingMasjidById(params.id);
  //   console.log(tracking);
  const from = searchParams.from || "/";
 
  if (!tracking) return notFound();

  return (
    <SideBar>
      <ProtectedPage>
        <section className="admin-page">
          {/* <h1>Tambah Progres</h1> */}
          <FormTambahLog tracking={tracking} from= {from} />
        </section>
      </ProtectedPage>
    </SideBar>
  );
}
