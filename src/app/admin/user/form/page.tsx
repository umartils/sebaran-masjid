"use client";
import { SideBar } from "@/components/SideBar";
import { AddUserForm } from "@/components/User/UserInputForm/AddUserForm";
import { ProtectedPage } from "@/components/ProtectedPage";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";

export default function InputUser() {
  const { data: session } = useSession();

  if (session?.user.role !== "Admin") return notFound();
  return (
    <SideBar>
      <ProtectedPage redirectTo="/admin/user/form">
        <section className="form-page">
          <AddUserForm />
        </section>
      </ProtectedPage>
    </SideBar>
  );
}
