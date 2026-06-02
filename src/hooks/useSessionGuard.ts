"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useCallback, useState } from "react";
import { useIdleTimer } from "./useIdleTimer";

const IDLE_TIMEOUT_MINUTES = 30;
const WARNING_BEFORE_MINUTES = 2;
const HEARTBEAT_INTERVAL_MS = 60 * 1000; // 60 detik

interface UseSessionGuardReturn {
  showWarning: boolean;
  remainingSeconds: number;
  stayLoggedIn: () => void;
}

export function useSessionGuard(): UseSessionGuardReturn {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(WARNING_BEFORE_MINUTES * 60);

  const handleLogout = useCallback(async (reason: "idle" | "expired" | "closed" = "idle") => {
    await signOut({ redirect: false });
    router.push(`/login?reason=${reason}`);
  }, [router]);

  const startCountdown = useCallback(() => {
    setRemainingSeconds(WARNING_BEFORE_MINUTES * 60);
    setShowWarning(true);

    countdownRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stayLoggedIn = useCallback(async () => {
    setShowWarning(false);
    if (countdownRef.current) clearInterval(countdownRef.current);
    setRemainingSeconds(WARNING_BEFORE_MINUTES * 60);
    // Update JWT lastActivity via NextAuth
    await update();
  }, [update]);

  // Heartbeat: update lastActivity di JWT secara berkala
  const sendHeartbeat = useCallback(async () => {
    if (status !== "authenticated") return;
    await update();
  }, [status, update]);

  // Idle timer
  const { resetTimer } = useIdleTimer({
    timeoutMinutes: IDLE_TIMEOUT_MINUTES,
    warningMinutes: WARNING_BEFORE_MINUTES,
    onWarning: startCountdown,
    onIdle: () => handleLogout("idle"),
    onActive: () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      setShowWarning(false);
    },
  });

  // Heartbeat interval
  useEffect(() => {
    if (status !== "authenticated") return;

    heartbeatRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);
    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [status, sendHeartbeat]);

  // Cek flag expired dari server
  useEffect(() => {
    if (session?.expired) {
      handleLogout("expired");
    }
  }, [session?.expired, handleLogout]);

  // Deteksi browser/tab ditutup
  useEffect(() => {
    if (status !== "authenticated") return;

    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        // Tab kembali aktif — validasi ulang sesi
        const updated = await update();
        if (!updated || (updated as any)?.expired) {
          handleLogout("expired");
        }
      }
    };

    const handleBeforeUnload = () => {
      // Gunakan sendBeacon agar request tetap terkirim saat halaman ditutup
      navigator.sendBeacon("/api/auth/signout", JSON.stringify({ callbackUrl: "/login" }));
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [status, update, handleLogout]);

  return { showWarning, remainingSeconds, stayLoggedIn };
}