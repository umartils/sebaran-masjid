"use client";

import {
  useEffect,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  useSession,
} from "next-auth/react";

interface ProtectedPageProps {
  children: React.ReactNode;

  redirectTo?: string;
}

export function ProtectedPage({
  children,
  redirectTo = "/input",
}: ProtectedPageProps) {
  const router = useRouter();

  const {
    status,
  } = useSession();

  useEffect(() => {
    if (
      status ===
      "unauthenticated"
    ) {
      router.replace(
        `/login?redirect=${redirectTo}`
      );
    }
  }, [
    status,
    router,
    redirectTo,
  ]);

  if (
    status === "loading"
  ) {
    return (
      <div className="protected-loading">
        <div className="protected-spinner" />

        <p>
          Memeriksa sesi login...
        </p>
      </div>
    );
  }

  if (
    status ===
    "unauthenticated"
  ) {
    return (
      <div className="protected-loading">
        <div className="protected-spinner" />

        <p>
          Mengalihkan ke halaman
          login...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}