import { AppFrame } from "@/components/AppFrame";
import { ProtectedPage } from "@/components/ProtectedPage";
import { getTrackingMasjidById } from "@/lib/tracking";
import { FormTambahLog } from "@/components/Progres/TambahLog/FormTambahLog";
import { notFound } from 'next/navigation';
import { SessionGuard } from "@/components/SessionGuard";

export default async function Page({ params }: { params: { id: string } }) {
  const tracking = await getTrackingMasjidById(params.id);
  //   console.log(tracking);

  if (!tracking) return notFound();

  return (
    <AppFrame>
      <ProtectedPage>
        <section className="admin-page">
          {/* <h1>Tambah Progres</h1> */}
          <FormTambahLog tracking={tracking} />
        </section>
      </ProtectedPage>
    </AppFrame>
  );
}