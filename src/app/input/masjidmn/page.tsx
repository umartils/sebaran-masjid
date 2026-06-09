"use client";
import { AppFrame } from "@/components/AppFrame";
import { FormMasjidMN } from "@/components/form/FormMasjidMN";
import { ProtectedPage } from "@/components/ProtectedPage";
import { SessionGuard } from "@/components/SessionGuard";
import { useState } from "react";
import Loading from "@/app/Loading";

export default function InputMasjidMN() {
  const [data, setData] = useState(null);
  // if (!data) return <Loading />;

  return (
    <SessionGuard>
      <AppFrame>
        <ProtectedPage redirectTo="/input/masjidmn">
          <section className="form-page">
            <FormMasjidMN />
          </section>
        </ProtectedPage>
      </AppFrame>
    </SessionGuard>
  );
}
