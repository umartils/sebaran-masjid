import { prisma } from "@/lib/prisma";
import type { MasjidMN } from "@/lib/types";

export async function getMasjidMN(): Promise<MasjidMN[]> {
  const records = await prisma.masjidMN.findMany({
    orderBy: { createdAt: "desc" },
  });

  return records.map((record) => ({
    ...record,
    condition: record.condition as MasjidMN["condition"],
  }));
}