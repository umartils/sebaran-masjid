-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('RUSAK_BERAT', 'RUSAK_SEDANG', 'RUSAK_RINGAN', 'LAYAK');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Relawan', 'Admin');

-- CreateEnum
CREATE TYPE "BuildingStatus" AS ENUM ('APPROVED', 'PENDING', 'REJECTED', 'DELETED');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Pelosok_Pedalaman', 'Muslim_Minoritas', 'Kampung_Mualaf', 'Terdampak_Bencana');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "nomorTelepon" TEXT,
    "role" TEXT NOT NULL DEFAULT 'Relawan',
    "image" TEXT,
    "password" TEXT,
    "userInput" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Masjid" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "idProvinsi" TEXT NOT NULL,
    "namaProvinsi" TEXT NOT NULL,
    "idKota" TEXT NOT NULL,
    "namaKota" TEXT NOT NULL,
    "idKecamatan" TEXT,
    "namaKecamatan" TEXT,
    "idDesa" TEXT,
    "namaDesa" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "kondisi" "Condition" NOT NULL DEFAULT 'RUSAK_SEDANG',
    "kategori" "Category" NOT NULL DEFAULT 'Pelosok_Pedalaman',
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
    "namaRelawan" TEXT,
    "noTelpRelawan" TEXT,
    "editedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Masjid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasjidMNBaru" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "idProvinsi" TEXT NOT NULL,
    "namaProvinsi" TEXT NOT NULL,
    "idKota" TEXT NOT NULL,
    "namaKota" TEXT NOT NULL,
    "idKecamatan" TEXT NOT NULL,
    "namaKecamatan" TEXT NOT NULL,
    "idDesa" TEXT NOT NULL,
    "namaDesa" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "kapasitas" INTEGER,
    "tahunDibangun" INTEGER,
    "statusTanah" TEXT,
    "catatan" TEXT,
    "kondisi" "Condition" DEFAULT 'RUSAK_SEDANG',
    "kategori" "Category" NOT NULL DEFAULT 'Pelosok_Pedalaman',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasjidMNBaru_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "Masjid_nama_idx" ON "Masjid"("nama");

-- CreateIndex
CREATE INDEX "Masjid_idProvinsi_idKota_idx" ON "Masjid"("idProvinsi", "idKota");

-- CreateIndex
CREATE INDEX "MasjidMNBaru_nama_idx" ON "MasjidMNBaru"("nama");

-- CreateIndex
CREATE INDEX "MasjidMNBaru_idProvinsi_idKota_idx" ON "MasjidMNBaru"("idProvinsi", "idKota");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
