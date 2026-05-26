import { prisma } from "@/lib/prisma";
import type { MasjidMNBaru } from "@/lib/types";
// import { KondisiMasjid } from "./types";

export async function getMasjidMN(): Promise<MasjidMNBaru[]> {
  const records = await prisma.masjidMNBaru.findMany({
    orderBy: { createdAt: "desc" },
  });

  return records.map((record) => ({
    ...record,
    kondisi: record.kondisi as MasjidMNBaru["kondisi"],
  }));
}