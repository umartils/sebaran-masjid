"use client";

import { useSession } from "next-auth/react";
import { useSessionGuard } from "@/hooks/useSessionGuard";
import { SessionWarningModal } from "./SessionWarningModal/SessionWarningModal";

export function SessionGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const { showWarning, remainingSeconds, stayLoggedIn } = useSessionGuard();

  // Hanya aktif jika user sudah login
  if (status !== "authenticated") return <>{children}</>;

  return (
    <>
      {children}
      {showWarning && (
        <SessionWarningModal
          remainingSeconds={remainingSeconds}
          onStayLoggedIn={stayLoggedIn}
        />
      )}
    </>
  );
}