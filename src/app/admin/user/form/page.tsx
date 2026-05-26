import { AppFrame } from "@/components/AppFrame";
import { AddUserForm } from "@/components/form/UserInputForm/AddUserForm";
import { ProtectedPage } from "@/components/ProtectedPage";

export default function InputUser() {
  return (
    <AppFrame>
      <ProtectedPage redirectTo="/admin/user/form">
        <section className="form-page">
          <AddUserForm />
        </section>
      </ProtectedPage>
    </AppFrame>
  );
}