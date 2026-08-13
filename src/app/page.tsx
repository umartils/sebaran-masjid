import { Suspense } from "react";
import TableSkeleton from "@/components/TableSkeleton";
import SebaranListSection from "@/components/SebaranMasjid/SebaranListSection";
export const dynamic = "force-dynamic";

export default async function HomePage() {

  return (
    <Suspense fallback={<TableSkeleton />}>
      <SebaranListSection />
    </Suspense>
  );
}
