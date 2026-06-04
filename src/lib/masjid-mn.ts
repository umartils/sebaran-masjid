import { prisma } from "@/lib/prisma";
import type { MapMasjidMNBaru, MasjidMNBaru } from "@/lib/types";
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

export async function getMapMasjidMN(): Promise<MapMasjidMNBaru[]> {
  try {
    return await prisma.masjidMNBaru.findMany({
      orderBy: { createdAt: "desc" },
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
      },
    });
  } catch (error) {
    console.error("[getMapMasjidMN] Prisma error:", error);
    return [];
  }
}
