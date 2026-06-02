import { AppFrame } from "@/components/AppFrame";
import { AddUserForm } from "@/components/form/UserInputForm/AddUserForm";
import { ProtectedPage } from "@/components/ProtectedPage";
import { SessionGuard } from "@/components/SessionGuard";

export default function InputUser() {
  return (
    <AppFrame>
      <SessionGuard>
        <ProtectedPage redirectTo="/admin/user/form">
          <section className="form-page">
            <AddUserForm />
          </section>
        </ProtectedPage>
      </SessionGuard>
    </AppFrame>
  );
}