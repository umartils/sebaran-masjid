-- CreateTable
CREATE TABLE "MasjidMN" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "provinceId" TEXT NOT NULL,
    "provinceName" TEXT NOT NULL,
    "regencyId" TEXT NOT NULL,
    "regencyName" TEXT NOT NULL,
    "districtId" TEXT,
    "districtName" TEXT,
    "villageId" TEXT,
    "villageName" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "capacity" INTEGER,
    "establishedYear" INTEGER,
    "landStatus" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasjidMN_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MasjidMN_name_idx" ON "MasjidMN"("name");

-- CreateIndex
CREATE INDEX "MasjidMN_provinceId_regencyId_idx" ON "MasjidMN"("provinceId", "regencyId");
