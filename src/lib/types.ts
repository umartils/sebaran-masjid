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

  export type StatusMasjid = "APPROVED" | "PENDING" | "REJECTED" | "DELETED";

  export interface Masjid {
    id: string;

    // Informasi dasar
    nama: string;
    alamat: string;

    // Wilayah
    idProvinsi: string;
    namaProvinsi: string;
    idKota: string;
    namaKota: string;
    idKecamatan?: string | null;
    namaKecamatan?: string | null;
    idDesa?: string | null;
    namaDesa?: string | null;

    // Lokasi
    latitude: number;
    longitude: number;

    // Kondisi masjid
    kondisi: KondisiMasjid;
    kategori: KategoriMasjid;

    // Informasi bangunan
    kapasitas?: number | null;
    tahunDibangun?: number | null;
    budgetAwal?: string | null;
    luasSekarang?: string | null;
    materialUtama?: string | null;
    statusPerluasan?: string | null;
    riwayatRenovasi?: string | null;
    targetPerluasan?: string | null;
    statusTanah?: string | null;
    statusListrik?: string | null;

    // Detail kerusakan
    waktuKerusakan?: string | null;
    alasan?: string | null;
    detail?: string | null;
    dampakKerusakan?: string | null;
    hambatanAktivitas?: string | null;
    kondisiHujan?: string | null;
    riwayatRoboh?: string | null;
    usahaPerbaikan?: string | null;
    riwayatMenerimaBantuan?: string | null;

    // Data jamaah
    kkMuslim?: number | null;
    jumlahJamaah?: string | null;
    avgProfesiJamaah?: string | null;
    avgGajiJamaah?: string | null;
    usahaJamaah?: string | null;

    // Akses dan kondisi sekitar
    jarakKeKota?: string | null;
    waktuTempuhKeKota?: string | null;
    kondisiAksesKota?: string | null;
    kondisiAksesDesa?: string | null;
    jenisKendaraan?: string | null;
    hambatanAkses?: string | null;

    // Informasi pembanding
    gantiNama?: string | null;
    masjidTerdekat?: string | null;
    aksesMasjidTerdekat?: string | null;
    jarakKeMasjidTerdekat?: string | null;
    alasanTidakPilihTerdekat?: string | null;

    // Kelayakan dan aktivitas
    kelayakan?: string | null;
    aktivitasMasjid?: string | null;
    jamaahSubuh?: string | null;
    jumlahSantri?: string | null;

    // PIC
    namaPic?: string | null;
    jabatanPic?: string | null;
    kontakPic?: string | null;

    // Catatan
    catatan?: string | null;

    // Status pengajuan
    statusPengajuan: StatusMasjid;

    // Dokumen & Foto
    documentImgUrl: string[];
    imageUrl: string[];

    namaRelawan?: string | null;
    noTelpRelawan?: string | null;

    // Timestamp
    createdAt: Date;
    updatedAt: Date;
    editedBy?: string | null;
  }

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
