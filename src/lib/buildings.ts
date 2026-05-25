import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache"; // ← tambah ini
import { sampleBuildings } from "@/lib/sample-data";
import type { Building } from "@/lib/types";

export async function getBuildings(): Promise<Building[]> {
  noStore(); // ← paksa tidak cache setiap request

  if (!process.env.DATABASE_URL) {
    return sampleBuildings;
  }

  try {
    const records = await prisma.building.findMany({
      orderBy: { createdAt: "desc" },
    });

    return records.map((record) => ({
      ...record,
      initialBudget: record.initialBudget?.toString() ?? null,
    }));
  } catch (error) {
    console.error("[getBuildings] Prisma error:", error); // ← log errornya!
    return sampleBuildings;
  }
}