"use client";
import { SideBar } from "@/components/SideBar";
import { FormMasjidMN } from "@/components/form/FormMasjidMN";
import { ProtectedPage } from "@/components/ProtectedPage";
import { SessionGuard } from "@/components/SessionGuard";

export default function InputMasjidMN() {
  return (
    <SessionGuard>
      <SideBar>
        <ProtectedPage redirectTo="/input/masjidmn">
          <section className="form-page">
            <FormMasjidMN />
          </section>
        </ProtectedPage>
      </SideBar>
    </SessionGuard>
  );
}
