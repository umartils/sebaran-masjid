"use client";
import { SideBar } from "@/components/SideBar";
import { FormMasjidMN } from "@/components/form/FormMasjidMN";
import { ProtectedPage } from "@/components/ProtectedPage";
import { SessionGuard } from "@/components/SessionGuard";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import TableSkeleton from "@/components/TableSkeleton";

export default function InputMasjidMN() {
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
