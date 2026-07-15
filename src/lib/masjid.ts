import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import type { MapMasjid, Masjid } from "@/lib/types";

export async function getMasjid(): Promise<Masjid[]> {
  noStore();

  try {
    const records = await prisma.masjid.findMany({
      orderBy: { createdAt: "desc" },
    });

    return records.map((record) => ({
      ...record,
      budgetAwal: record.budgetAwal?.toString() ?? null,
    }));
  } catch (error) {
    console.error("[getMasjid] Prisma error:", error);
    return [];
  }
}

export async function getMasjidById(id: string): Promise<Masjid | null> {
  noStore();

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
export async function getMasjidByRelawan(userId: string): Promise<Masjid[]> {
  noStore();

  try {
    const records = await prisma.masjid.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return records.map((record) => ({
      ...record,
      budgetAwal: record.budgetAwal?.toString() ?? null,
    }));
  } catch (error) {
    console.error("[getMasjidByRelawan] Prisma error:", error);
    return [];
  }
}

export async function getMapMasjid(): Promise<MapMasjid[]> {
  try {
    return await prisma.masjid.findMany({
      where: { 
        statusPengajuan: {
          in: [
            "APPROVED",
            "ON_AIR"
          ]
        }
      },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        nama: true,
        alamat: true,
        idProvinsi: true,
        namaProvinsi: true,
        namaKota: true,
        namaKecamatan: true,
        namaDesa: true,
        latitude: true,
        longitude: true,
        kategori: true,
        kapasitas: true,
        tahunDibangun: true,
        statusPengajuan: true,
      },
    });
  } catch (error) {
    console.error("[getMapMasjid] Prisma error:", error);
    return [];
  }
}
