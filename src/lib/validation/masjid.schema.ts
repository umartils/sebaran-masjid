import { z } from "zod";

import {
    optionalNumber,
    optionalString,
    optionalPositiveInt,
    mediaUrl
} from "./common"

import {
    kondisiSchema,
    kategoriSchema
} from "./enums"

export const masjidSchema = z.object({
  // ── Info Umum ──────────────────────────────────
  id: z.string().min(1),
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
  budgetAwal: optionalPositiveInt,

  // ── Fisik & Bangunan ───────────────────────────
  luasSekarang: optionalString,
  kapasitas: optionalPositiveInt,
  materialUtama: optionalString,
  statusPerluasan: optionalString,
  riwayatRenovasi: optionalString,
  targetPerluasan: optionalString,

  // ── Legalitas & Kondisi Kerusakan ─────────────
  // kondisi: kondisiSchema,
  kategori: kategoriSchema,
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
  kkMuslim: optionalPositiveInt,
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
  userId: optionalString,

  // ── Media ─────────────────────────────────────
  documentImgUrl: mediaUrl,
  imageUrl: mediaUrl,
  videoUrl: mediaUrl,
});

export type PengajuanMasjid =
    z.infer<typeof masjidSchema>;

// export type KondisiMasjid = 
//     z.infer<typeof kondisiSchema>;

export type KategoriMasjid = 
    z.infer<typeof kategoriSchema>;