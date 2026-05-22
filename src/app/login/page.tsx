import { Suspense } from "react";
import LoginPageClient from "@/components/clientPage/LoginPageClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="protected-loading"><div className="protected-spinner" /></div>}>
      <LoginPageClient />
    </Suspense>
  );
}