import { SideBar } from "@/components/SideBar";
import { FormPengajuan } from "@/components/Pengajuan/FormPengajuan";
import { ProtectedPage } from "@/components/ProtectedPage";

export default function InputPage() {
  return (
    <SideBar>
      <ProtectedPage redirectTo="/input/pengajuan">
        <section className="form-page">
          <FormPengajuan />
        </section>
      </ProtectedPage>
    </SideBar>
  );
}
