/*
  Warnings:

  - The `kondisi` column on the `MasjidMNBaru` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `createdAt` on table `MasjidMNBaru` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `MasjidMNBaru` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "MasjidMNBaru" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updatedAt" SET NOT NULL,
DROP COLUMN "kondisi",
ADD COLUMN     "kondisi" "Condition" NOT NULL DEFAULT 'RUSAK_SEDANG';

-- CreateIndex
CREATE INDEX "MasjidMNBaru_nama_idx" ON "MasjidMNBaru"("nama");

-- CreateIndex
CREATE INDEX "MasjidMNBaru_idProvinsi_idKota_idx" ON "MasjidMNBaru"("idProvinsi", "idKota");
