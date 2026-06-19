import { tool } from 'ai';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

/**
 * PENTING — Privasi & Keamanan Data:
 * - Hanya masjid dengan statusPengajuan = APPROVED yang boleh ditampilkan ke publik.
 *   Masjid PENDING/REJECTED/DELETED tidak relevan/tidak pantas dipublikasikan via chatbot.
 * - Field sensitif (kontak PIC, no telp relawan, data ekonomi jamaah, dll) TIDAK pernah
 *   di-select di tools ini. Hanya field yang aman untuk dipublikasikan.
 */

const SAFE_MASJID_SELECT = {
  id: true,
  nama: true,
  alamat: true,
  namaProvinsi: true,
  namaKota: true,
  namaKecamatan: true,
  namaDesa: true,
  kondisi: true,
  kategori: true,
  kapasitas: true,
  tahunDibangun: true,
  statusPengajuan: true,
  imageUrl: true,
} as const;

export const masjidTools = {
  // 1. Cari / list masjid terdaftar (approved saja)
  getDaftarMasjid: tool({
    description:
      "Cari daftar masjid yang sudah terdaftar dan disetujui (approved) di SEIMAN. " +
      "Bisa difilter berdasarkan provinsi, kota, kategori, atau kondisi bangunan. " +
      "Gunakan tool ini saat user bertanya tentang masjid apa saja yang terdaftar di suatu daerah." +
      "Berikan informasi semua nama masjid yang terdaftar di sistem jika user bertanya",
    inputSchema: z.object({
      namaProvinsi: z
        .string()
        .optional()
        .describe('Nama provinsi, contoh: "Jawa Barat"'),
      namaKota: z
        .string()
        .optional()
        .describe('Nama kota/kabupaten, contoh: "Bandung"'),
      kategori: z
        .enum([
          "Pelosok_Pedalaman",
          "Muslim_Minoritas",
          "Kampung_Mualaf",
          "Terdampak_Bencana",
        ])
        .optional()
        .describe("Kategori masjid"),
      kondisi: z
        .enum(["RUSAK_BERAT", "RUSAK_SEDANG", "RUSAK_RINGAN", "LAYAK"])
        .optional()
        .describe("Kondisi bangunan masjid saat ini"),
      limit: z
        .number()
        .min(1)
        .max(20)
        .default(10)
        .describe("Jumlah maksimum hasil"),
    }),
    execute: async ({ namaProvinsi, namaKota, kategori, kondisi, limit }) => {
      const masjidList = await prisma.masjid.findMany({
        where: {
          statusPengajuan: "APPROVED",
          ...(namaProvinsi && {
            namaProvinsi: { contains: namaProvinsi, mode: "insensitive" },
          }),
          ...(namaKota && {
            namaKota: { contains: namaKota, mode: "insensitive" },
          }),
          ...(kategori && { kategori }),
          ...(kondisi && { kondisi }),
        },
        select: SAFE_MASJID_SELECT,
        take: limit,
        orderBy: { createdAt: "desc" },
      });

      if (masjidList.length === 0) {
        return {
          found: false,
          message: "Tidak ada masjid yang cocok dengan kriteria tersebut.",
        };
      }

      return {
        found: true,
        total: masjidList.length,
        masjid: masjidList,
      };
    },
  }),

  // 2. Detail satu masjid spesifik (by nama atau id)
  getDetailMasjid: tool({
    description:
      "Ambil detail lengkap satu masjid berdasarkan nama atau ID. " +
      "Gunakan saat user bertanya spesifik tentang satu masjid tertentu.",
    inputSchema: z.object({
      nama: z
        .string()
        .optional()
        .describe("Nama masjid, boleh sebagian (partial match)"),
      masjidId: z
        .string()
        .optional()
        .describe("ID masjid jika sudah diketahui"),
    }),
    execute: async ({ nama, masjidId }) => {
      if (!nama && !masjidId) {
        return {
          found: false,
          message: "Nama atau ID masjid harus disebutkan.",
        };
      }

      const masjid = await prisma.masjid.findFirst({
        where: {
          statusPengajuan: "APPROVED",
          ...(masjidId && { id: masjidId }),
          ...(nama && { nama: { contains: nama, mode: "insensitive" } }),
        },
        select: {
          ...SAFE_MASJID_SELECT,
          tracking: {
            select: { status: true, persentase: true },
          },
        },
      });

      if (!masjid) {
        return {
          found: false,
          message: `Masjid "${nama ?? masjidId}" tidak ditemukan.`,
        };
      }

      return { found: true, masjid };
    },
  }),

  // 3. Progress pembangunan masjid (dari TrackingMasjid + logs)
  getProgresMasjid: tool({
    description:
      "Ambil progress/tracking pembangunan sebuah masjid, termasuk persentase " +
      "penyelesaian dan riwayat log progres terbaru. Gunakan saat user bertanya " +
      "sejauh mana pembangunan/renovasi masjid tertentu.",
    inputSchema: z.object({
      nama: z.string().optional().describe("Nama masjid, boleh sebagian"),
      masjidId: z
        .string()
        .optional()
        .describe("ID masjid jika sudah diketahui"),
      jumlahLog: z
        .number()
        .min(1)
        .max(10)
        .default(5)
        .describe("Jumlah log terbaru yang diambil"),
    }),
    execute: async ({ nama, masjidId, jumlahLog }) => {
      if (!nama && !masjidId) {
        return {
          found: false,
          message: "Nama atau ID masjid harus disebutkan.",
        };
      }

      const masjid = await prisma.masjid.findFirst({
        where: {
          statusPengajuan: "APPROVED",
          ...(masjidId && { id: masjidId }),
          ...(nama && { nama: { contains: nama, mode: "insensitive" } }),
        },
        select: {
          id: true,
          nama: true,
          tracking: {
            select: {
              status: true,
              persentase: true,
              firstUpdate: true,
              logs: {
                orderBy: { createdAt: "desc" },
                take: jumlahLog,
                select: {
                  progres: true,
                  persentase: true,
                  nextProgres: true,
                  waktuProgres: true,
                  createdAt: true,
                },
              },
            },
          },
        },
      });

      if (!masjid) {
        return {
          found: false,
          message: `Masjid "${nama ?? masjidId}" tidak ditemukan.`,
        };
      }

      if (!masjid.tracking) {
        return {
          found: true,
          nama: masjid.nama,
          hasTracking: false,
          message: "Masjid ini belum memiliki data tracking pembangunan.",
        };
      }

      return {
        found: true,
        masjidId: masjid.id,
        nama: masjid.nama,
        hasTracking: true,
        statusProgres: masjid.tracking.status, // ON_PROGRESS | SELESAI
        persentase: masjid.tracking.persentase,
        logs: masjid.tracking.logs,
      };
    },
  }),

  // 4. Link download laporan PDF (single & all reports)
  getLaporanProgresPdf: tool({
    description:
      "Ambil link/URL untuk mendownload laporan progres pembangunan masjid dalam format PDF. " +
      "Gunakan saat user minta laporan, dokumen, atau ingin mendownload progres masjid. " +
      "Selalu gunakan tool getProgresMasjid dulu untuk menampilkan ringkasan progres ke user, " +
      "baru sertakan link download dari tool ini.",
    inputSchema: z.object({
      nama: z.string().optional().describe("Nama masjid, boleh sebagian"),
      masjidId: z
        .string()
        .optional()
        .describe("ID masjid jika sudah diketahui"),
      semuaLaporan: z
        .boolean()
        .default(false)
        .describe(
          "true jika user ingin semua laporan mingguan dalam satu dokumen, false untuk laporan terbaru saja"
        ),
    }),
    execute: async ({ nama, masjidId, semuaLaporan }) => {
      const masjid = await prisma.masjid.findFirst({
        where: {
          statusPengajuan: "APPROVED",
          ...(masjidId && { id: masjidId }),
          ...(nama && { nama: { contains: nama, mode: "insensitive" } }),
        },
        select: { id: true, nama: true, tracking: { select: { id: true } } },
      });

      if (!masjid) {
        return {
          found: false,
          message: `Masjid "${nama ?? masjidId}" tidak ditemukan.`,
        };
      }

      if (!masjid.tracking) {
        return {
          found: true,
          hasReport: false,
          message: `Masjid "${masjid.nama}" belum memiliki data progres untuk dilaporkan.`,
        };
      }

      // Sesuaikan path ini dengan route handler PDF yang sudah ada di SEIMAN
      const downloadUrl = semuaLaporan
        ? `/admin/dashboard/tracking/pdf/${masjid.id}/all`
        : `/admin/dashboard/tracking/pdf/${masjid.id}`;

      return {
        found: true,
        hasReport: true,
        nama: masjid.nama,
        label: semuaLaporan
          ? "Semua Laporan Progres"
          : "Laporan Progres Terbaru",
        downloadUrl,
      };
    },
  }),

  getFotoMasjid: tool({
    description:
      "Mengambil foto/gambar masjid berdasarkan nama masjid." +
      "Ambil url foto masjid untuk ditampilkan kepada user" +
      "Gunakan saat user meminta foto atau gambar masjid atau bertanya mengenai kondisi masjid" +
      "Selalu gunakan tool getFotoMasjid jika user meminta foto atau gambar masjid",

    inputSchema: z.object({
      nama: z.string(),
    }),

    execute: async ({ nama }) => {
      const masjid = await prisma.masjid.findFirst({
        where: {
          statusPengajuan: "APPROVED",
          nama: {
            contains: nama,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          nama: true,
          imageUrl: true,
        },
      });

      if (!masjid) {
        return {
          found: false,
        };
      }

      return {
        found: true,
        id: masjid.id,
        nama: masjid.nama,
        imageUrl: masjid.imageUrl,
      };
    },
  }),
};