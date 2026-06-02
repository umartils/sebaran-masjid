"use client";

import { useEffect, useRef, useCallback } from "react";

interface UseIdleTimerOptions {
  timeoutMinutes: number;
  warningMinutes?: number; // Munculkan warning N menit sebelum logout
  onIdle: () => void;
  onWarning?: () => void;
  onActive?: () => void;
}

export function useIdleTimer({
  timeoutMinutes,
  warningMinutes = 2,
  onIdle,
  onWarning,
  onActive,
}: UseIdleTimerOptions) {
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isWarningShownRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
  }, []);

  const resetTimer = useCallback(() => {
    clearTimers();
    isWarningShownRef.current = false;

    const timeoutMs = timeoutMinutes * 60 * 1000;
    const warningMs = (timeoutMinutes - warningMinutes) * 60 * 1000;

    // Set warning timer (muncul sebelum logout)
    if (onWarning && warningMs > 0) {
      warningTimerRef.current = setTimeout(() => {
        isWarningShownRef.current = true;
        onWarning();
      }, warningMs);
    }

    // Set idle/logout timer
    idleTimerRef.current = setTimeout(() => {
      onIdle();
    }, timeoutMs);
  }, [timeoutMinutes, warningMinutes, onIdle, onWarning, clearTimers]);

  const handleActivity = useCallback(() => {
    if (isWarningShownRef.current) {
      // Jika warning sudah tampil dan user aktif lagi, reset
      isWarningShownRef.current = false;
      onActive?.();
    }
    resetTimer();
  }, [resetTimer, onActive]);

  useEffect(() => {
    const events = ["mousedown", "keydown", "scroll", "touchstart", "pointermove"];

    events.forEach((e) => window.addEventListener(e, handleActivity, { passive: true }));
    resetTimer(); // mulai timer saat mount

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      clearTimers();
    };
  }, [handleActivity, resetTimer, clearTimers]);

  return { resetTimer };
}