import { prisma } from "@/lib/prisma";

export async function getMasjidMN() {
  const records = await prisma.masjidMN.findMany({
    orderBy: { createdAt: "desc" },
  });

  return records;
}
