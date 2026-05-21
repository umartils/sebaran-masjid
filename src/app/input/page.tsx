import { AppFrame } from "@/components/AppFrame";
import { BuildingForm } from "@/components/form/BuildingForm";

export default function InputPage() {
  return (
    <AppFrame>
      <section className="form-page">
        <BuildingForm />
      </section>
    </AppFrame>
  );
}

