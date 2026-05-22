import { Suspense } from "react";
import RegisterPageClient from "@/components/clientPage/RegisterPageClient";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="protected-loading"><div className="protected-spinner" /></div>}>
      <RegisterPageClient />
    </Suspense>
  );
}