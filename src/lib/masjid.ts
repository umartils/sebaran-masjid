import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache"; // ← tambah ini
// import { sampleMasjid } from "@/lib/sample-data";
import type { Masjid } from "@/lib/types";

export async function getMasjid(): Promise<Masjid[]> {
  noStore(); // ← paksa tidak cache setiap request

  // if (!process.env.DATABASE_URL) {
  //   return sampleMasjid;
  // }

  try {
    const records = await prisma.masjid.findMany({
      orderBy: { createdAt: "desc" },
    });

    return records.map((record) => ({
      ...record,
      budgetAwal: record.budgetAwal?.toString() ?? null,
    }));
  } catch (error) {
    console.error("[getMasjid] Prisma error:", error); // ← log errornya!
    // return sampleMasjid;
    return [];
  }
}

export async function getMasjidById(id: string): Promise<Masjid | null> {
  noStore();

  // if (!process.env.DATABASE_URL) {
  //   return sampleMasjid.find((b) => b.id === id) ?? null;
  // }

  try {
    const record = await prisma.masjid.findUnique({
      where: { id },
    });

    if (!record) return null;

    return {
      ...record,
      budgetAwal: record.budgetAwal?.toString() ?? null,
    };
  } catch (error) {
    console.error("[getMasjidById] Prisma error:", error);
    return null;
  }
}