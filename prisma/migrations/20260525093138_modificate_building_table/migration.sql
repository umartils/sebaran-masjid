/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `MasjidMN` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MasjidMN" DROP COLUMN "imageUrl";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "nomorTelepon" TEXT;

-- CreateTable
CREATE TABLE "Masjid" (
    "id" TEXT NOT NULL,
    "nama" TEXT,
    "alamat" TEXT,
    "idProvinsi" TEXT,
    "namaProvinsi" TEXT,
    "idKota" TEXT,
    "namaKota" TEXT,
    "idKecamatan" TEXT,
    "namaKecamatan" TEXT,
    "idDesa" TEXT,
    "namaDesa" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "kondisi" "Condition" NOT NULL DEFAULT 'RUSAK_SEDANG',
    "kapasitas" INTEGER,
    "tahunDibangun" INTEGER,
    "budgetAwal" DECIMAL(14,2),
    "luasSekarang" TEXT,
    "materialUtama" TEXT,
    "statusPerluasan" TEXT,
    "riwayatRenovasi" TEXT,
    "targetPerluasan" TEXT,
    "statusTanah" TEXT,
    "statusListrik" TEXT,
    "waktuKerusakan" TEXT,
    "alasan" TEXT,
    "detail" TEXT,
    "dampakKerusakan" TEXT,
    "hambatanAktivitas" TEXT,
    "kondisiHujan" TEXT,
    "riwayatRoboh" TEXT,
    "usahaPerbaikan" TEXT,
    "riwayatMenerimaBantuan" TEXT,
    "kkMuslim" INTEGER,
    "jumlahJamaah" TEXT,
    "avgProfesiJamaah" TEXT,
    "avgGajiJamaah" TEXT,
    "usahaJamaah" TEXT,
    "jarakKeKota" TEXT,
    "waktuTempuhKeKota" TEXT,
    "kondisiAksesKota" TEXT,
    "kondisiAksesDesa" TEXT,
    "jenisKendaraan" TEXT,
    "hambatanAkses" TEXT,
    "gantiNama" TEXT,
    "masjidTerdekat" TEXT,
    "aksesMasjidTerdekat" TEXT,
    "jarakKeMasjidTerdekat" TEXT,
    "alasanTidakPilihTerdekat" TEXT,
    "kelayakan" TEXT,
    "aktivitasMasjid" TEXT,
    "jamaahSubuh" TEXT,
    "jumlahSantri" TEXT,
    "namaPic" TEXT,
    "jabatanPic" TEXT,
    "kontakPic" TEXT,
    "catatan" TEXT,
    "statusPengajuan" "BuildingStatus" NOT NULL DEFAULT 'PENDING',
    "documentImgUrl" TEXT[],
    "imageUrl" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Masjid_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Masjid_nama_idx" ON "Masjid"("nama");

-- CreateIndex
CREATE INDEX "Masjid_idProvinsi_idKota_idx" ON "Masjid"("idProvinsi", "idKota");
