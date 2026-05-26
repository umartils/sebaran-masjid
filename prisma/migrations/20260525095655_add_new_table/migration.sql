-- CreateTable
CREATE TABLE "MasjidMNBaru" (
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "MasjidMNBaru_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MasjidMNBaru_nama_idx" ON "MasjidMNBaru"("nama");

-- CreateIndex
CREATE INDEX "MasjidMNBaru_idProvinsi_idKota_idx" ON "MasjidMNBaru"("idProvinsi", "idKota");
