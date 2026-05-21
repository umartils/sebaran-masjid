-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('RUSAK_BERAT', 'RUSAK_SEDANG', 'RUSAK_RINGAN', 'LAYAK');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Building" (
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
    "condition" "Condition" NOT NULL DEFAULT 'RUSAK_SEDANG',
    "capacity" INTEGER,
    "establishedYear" INTEGER,
    "initialBudget" DECIMAL(14,2),
    "currentArea" TEXT,
    "mainMaterial" TEXT,
    "expansionStatus" TEXT,
    "renovationHistory" TEXT,
    "expansionTarget" TEXT,
    "landStatus" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Building_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "Building_name_idx" ON "Building"("name");

-- CreateIndex
CREATE INDEX "Building_provinceId_regencyId_idx" ON "Building"("provinceId", "regencyId");
