-- DropIndex
DROP INDEX "MasjidMNBaru_idProvinsi_idKota_idx";

-- DropIndex
DROP INDEX "MasjidMNBaru_nama_idx";

-- AlterTable
ALTER TABLE "MasjidMNBaru" ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP NOT NULL;
