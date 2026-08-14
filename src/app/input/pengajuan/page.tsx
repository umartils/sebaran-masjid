"use client";
import { SideBar } from "@/components/SideBar";
import { FormPengajuan } from "@/components/Pengajuan/FormPengajuan";
import { ProtectedPage } from "@/components/ProtectedPage";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import TableSkeleton from "@/components/TableSkeleton";

export default function InputPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  if (status === "loading") { 
    return (
      <TableSkeleton />
    )
  }
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }
  if (session?.user.role !== "Admin") return notFound();

  return (
    <SideBar>
      <ProtectedPage redirectTo="/input/pengajuan">
        <section className="form-page">
          <FormPengajuan />
        </section>
      </ProtectedPage>
    </SideBar>
  );
}
