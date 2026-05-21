import { prisma } from "@/lib/prisma";
import { sampleBuildings } from "@/lib/sample-data";
import type { Building } from "@/lib/types";

export async function getBuildings(): Promise<Building[]> {
  if (!process.env.DATABASE_URL) {
    return sampleBuildings;
  }

  try {
    const records = await prisma.building.findMany({
      orderBy: { createdAt: "desc" }
    });

    return records.map((record) => ({
      ...record,
      initialBudget: record.initialBudget?.toString() ?? null
    }));
  } catch {
    return sampleBuildings;
  }
}

