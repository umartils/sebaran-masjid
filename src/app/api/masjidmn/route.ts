import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getMasjidMN } from "@/lib/masjid-mn";

const optionalString = z.string().optional();

const masjidSchema = z.object({
  id: z.string().min(1),
  nama: z.string().min(3),
  alamat: z.string().min(5),
  idProvinsi: z.string().min(1),
  namaProvinsi: z.string().min(1),
  idKota: z.string().min(1),
  namaKota: z.string().min(1),
  idKecamatan: z.string().min(1),
  namaKecamatan: z.string().min(1),
  idDesa: z.string().min(1),
  namaDesa: z.string().min(1),
  latitude: z.coerce.number().min(-11).max(6),
  longitude: z.coerce.number().min(94).max(142),
  kapasitas: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  tahunDibangun: z.coerce
    .number()
    .int()
    .min(1500)
    .max(new Date().getFullYear())
    .optional()
    .or(z.literal("").transform(() => undefined)),
  kondisi: z.enum(["LAYAK", "RUSAK_RINGAN", "RUSAK_SEDANG", "RUSAK_BERAT"]),
  kategori: z.enum([
    "Pelosok_Pedalaman",
    "Kampung_Mualaf",
    "Muslim_Minoritas",
    "Terdampak_Bencana",
  ]),
  statusTanah: optionalString,
  catatan: optionalString,
});

export async function GET() {
  const buildings = await getMasjidMN();
  return NextResponse.json(buildings);
}

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      {
        message:
          "DATABASE_URL belum diatur. Data belum disimpan ke PostgreSQL.",
      },
      { status: 503 }
    );
  }

  const body = await request.json();
  const parsed = masjidSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Data tidak valid", errors: parsed.error.flatten() },
      { status: 422 }
    );
  }

  try {
    const masjidMN = await prisma.masjidMNBaru.create({
      data: parsed.data,
    });

    return NextResponse.json({ masjidMN }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Gagal menyimpan data bangunan." },
      { status: 500 }
    );
  }
}

