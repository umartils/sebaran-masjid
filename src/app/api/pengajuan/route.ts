import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getMasjid } from "@/lib/masjid";

const optionalString = z.string().optional();
const optionalNumber = z.coerce
  .number()
  .optional()
  .or(z.literal("").transform(() => undefined));

const masjidSchema = z.object({
  // ── Info Umum ──────────────────────────────────
  nama: z.string().min(3),
  alamat: z.string().min(5),
  idProvinsi: z.string().min(1),
  namaProvinsi: z.string().min(1),
  idKota: z.string().min(1),
  namaKota: z.string().min(1),
  idKecamatan: optionalString,
  namaKecamatan: optionalString,
  idDesa: optionalString,
  namaDesa: optionalString,
  latitude: z.coerce.number().min(-11).max(6),
  longitude: z.coerce.number().min(94).max(142),
  tahunDibangun: z.coerce
    .number()
    .int()
    .min(1500)
    .max(new Date().getFullYear())
    .optional()
    .or(z.literal("").transform(() => undefined)),
  budgetAwal: z.coerce
    .number()
    .nonnegative()
    .optional()
    .or(z.literal("").transform(() => undefined)),

  // ── Fisik & Bangunan ───────────────────────────
  luasSekarang: optionalString,
  kapasitas: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  materialUtama: optionalString,
  statusPerluasan: optionalString,
  riwayatRenovasi: optionalString,
  targetPerluasan: optionalString,

  // ── Legalitas & Kondisi Kerusakan ─────────────
  kondisi: z.enum(["RUSAK_BERAT", "RUSAK_SEDANG", "RUSAK_RINGAN", "LAYAK"]),
  statusTanah: optionalString,
  statusListrik: optionalString,
  waktuKerusakan: optionalString,
  alasan: optionalString,
  dampakKerusakan: optionalString,
  hambatanAktivitas: optionalString,
  kondisiHujan: optionalString,
  riwayatRoboh: optionalString,
  usahaPerbaikan: optionalString,
  riwayatMenerimaBantuan: optionalString,

  // ── Data Masyarakat ────────────────────────────
  kkMuslim: z.coerce
    .number()
    .int()
    .nonnegative()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  jumlahJamaah: optionalString,
  avgProfesiJamaah: optionalString,
  avgGajiJamaah: optionalString,
  usahaJamaah: optionalString,

  // ── Akses & Lingkungan ─────────────────────────
  jarakKeKota: optionalString,
  waktuTempuhKeKota: optionalString,
  kondisiAksesKota: optionalString,
  kondisiAksesDesa: optionalString,
  jenisKendaraan: optionalString,
  hambatanAkses: optionalString,
  gantiNama: optionalString,
  masjidTerdekat: optionalString,

  // ── Aktivitas Ibadah ───────────────────────────
  kelayakan: optionalString,
  aktivitasMasjid: optionalString,
  jamaahSubuh: optionalString,
  jumlahSantri: optionalString,

  // ── PIC & Catatan ──────────────────────────────
  namaPic: optionalString,
  jabatanPic: optionalString,
  kontakPic: optionalString,
  catatan: optionalString,
  namaRelawan: optionalString,
  noTelpRelawan: optionalString,

  // ── Gambar ─────────────────────────────────────
  documentImgUrl: z.array(z.string().url()).default([]),
  imageUrl: z.array(z.string().url()).default([]),
});

export async function GET() {
  const masjid = await getMasjid();
  return NextResponse.json(masjid);
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
    const masjid = await prisma.masjid.create({
      data: parsed.data,
    });
    return NextResponse.json({ masjid }, { status: 201 });
  } catch (error) {
    console.error("Prisma error:", error);
    return NextResponse.json(
      { message: "Gagal menyimpan data masjid." },
      { status: 500 }
    );
  }
}