import { AppFrame } from "@/components/AppFrame";
import { FormMasjidMN } from "@/components/form/FormMasjidMN";
import { ProtectedPage } from "@/components/ProtectedPage";

export default function InputMasjidMN() {
  return (
    <AppFrame>
      <ProtectedPage redirectTo="/input/masjidmn">
        <section className="form-page">
          <FormMasjidMN />
        </section>
      </ProtectedPage>
    </AppFrame>
  );
}