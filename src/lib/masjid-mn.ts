import { prisma } from "@/lib/prisma";
import { sampleBuildings } from "@/lib/sample-data";
import type { Building } from "@/lib/types";

export async function getMasjidMN(): Promise<Building[]> {
  if (!process.env.DATABASE_URL) {
    return sampleBuildings;
  }

  try {
    const records = await prisma.masjidMN.findMany({
      orderBy: { createdAt: "desc" }
    });

    return records.map((record) => ({
      ...record
    }));
  } catch {
    return sampleBuildings;
  }
}

