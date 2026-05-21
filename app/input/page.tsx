import { AppFrame } from "@/components/AppFrame";
import { BuildingForm } from "@/components/BuildingForm";

export default function InputPage() {
  return (
    <AppFrame>
      <section className="min-h-screen bg-[linear-gradient(90deg,#f6f9fc,#ffffff_18%,#ffffff_82%,#f6f9fc)] px-6 py-[50px] max-md:px-3.5 max-md:pb-6 max-md:pt-[86px]">
        <BuildingForm />
      </section>
    </AppFrame>
  );
}

