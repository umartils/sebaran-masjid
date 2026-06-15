import { Prisma } from "@/generated/prisma/client";

export type KondisiMasjid =
  | "RUSAK_BERAT"
  | "RUSAK_SEDANG"
  | "RUSAK_RINGAN"
  | "LAYAK";

export type KategoriMasjid =
  | "Pelosok_Pedalaman"
  | "Muslim_Minoritas"
  | "Kampung_Mualaf"
  | "Terdampak_Bencana";

export type UserRole = "Admin" | "Relawan";

export type StatusMasjid = "APPROVED" | "PENDING" | "REJECTED" | "DELETED";

export type ProgresStatus = "ON_PROGRESS" | "SELESAI";

type MasjidDb = Prisma.MasjidGetPayload<{}>;

export type Masjid = Omit<MasjidDb, "budgetAwal"> & {
  budgetAwal: string | null;
};

export type MapMasjid = Pick<
  Masjid,
  | "id"
  | "nama"
  | "alamat"
  | "idProvinsi"
  | "namaProvinsi"
  | "namaKota"
  | "namaKecamatan"
  | "namaDesa"
  | "latitude"
  | "longitude"
  | "kategori"
  | "kapasitas"
  | "tahunDibangun"
  | "statusPengajuan"
>;

export type Region = {
  id: string;
  name: string;
};

export type MasjidMNBaru = {
  id: string;

  // Informasi dasar
  nama: string;
  alamat: string;

  // Wilayah
  idProvinsi: string;
  namaProvinsi: string;
  idKota: string;
  namaKota: string;
  idKecamatan?: string;
  namaKecamatan?: string;
  idDesa?: string;
  namaDesa?: string;

  // Lokasi
  latitude: number;
  longitude: number;

  // Kondisi masjid
  kondisi: KondisiMasjid;
  kategori: KategoriMasjid;

  // Informasi bangunan
  kapasitas?: number | null;
  tahunDibangun?: number | null;
  createdAt: Date;
  updatedAt: Date;
  catatan?: string | null;
};

export type MapMasjidMNBaru = Pick<
  MasjidMNBaru,
  | "id"
  | "nama"
  | "alamat"
  | "idProvinsi"
  | "namaProvinsi"
  | "namaKota"
  | "namaKecamatan"
  | "namaDesa"
  | "latitude"
  | "longitude"
  | "kategori"
  | "kapasitas"
  | "tahunDibangun"
>;

export type TrackingMasjidList = Prisma.TrackingMasjidGetPayload<{
  include: {
    masjid: true;
  };
}>;

export type TrackingMasjidDetail = Prisma.TrackingMasjidGetPayload<{
  include: {
    masjid: true;
    logs: true;
  };
}>;

export type User = Prisma.UserGetPayload<{}>;

// export type TrackingMasjidLog = {
//   id: string;
//   trackingId: string;
//   progres: string | null;
//   persentase: number;
//   nextProgres: string | null;
//   imgUrls: string[];
//   createdAt: Date;
//   updatedAt: Date;
// };

export type TrackingMasjidLog = Prisma.TrackingMasjidLogGetPayload<{
  include: {
    tracking: true;
  };
}>;
