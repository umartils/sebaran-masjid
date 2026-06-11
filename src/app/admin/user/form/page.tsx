"use client";
import { AppFrame } from "@/components/AppFrame";
import { AddUserForm } from "@/components/form/UserInputForm/AddUserForm";
import { ProtectedPage } from "@/components/ProtectedPage";
import { SessionGuard } from "@/components/SessionGuard";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";

export default function InputUser() {
  const { data: session } = useSession();

  if (session?.user.role !== "Admin") return notFound();
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
