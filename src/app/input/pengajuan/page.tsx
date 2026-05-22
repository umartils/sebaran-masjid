import { AppFrame } from "@/components/AppFrame";
import { BuildingForm } from "@/components/form/BuildingForm";
import { ProtectedPage } from "@/components/ProtectedPage";

export default function InputPage() {
  return (
    <AppFrame>
      <ProtectedPage redirectTo="/input/pengajuan">
        <section className="form-page">
          <BuildingForm />
        </section>
      </ProtectedPage>
    </AppFrame>
  );
}