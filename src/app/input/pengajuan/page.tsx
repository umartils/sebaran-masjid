import { AppFrame } from "@/components/AppFrame";
import { FormPengajuan } from "@/components/form/FormPengajuan/FormPengajuan";
import { ProtectedPage } from "@/components/ProtectedPage";

export default function InputPage() {
  return (
    <AppFrame>
      <ProtectedPage redirectTo="/input/pengajuan">
        <section className="form-page">
          <FormPengajuan />
        </section>
      </ProtectedPage>
    </AppFrame>
  );
}