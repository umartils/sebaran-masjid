/*
  Warnings:

  - Made the column `idKecamatan` on table `MasjidMNBaru` required. This step will fail if there are existing NULL values in that column.
  - Made the column `namaKecamatan` on table `MasjidMNBaru` required. This step will fail if there are existing NULL values in that column.
  - Made the column `idDesa` on table `MasjidMNBaru` required. This step will fail if there are existing NULL values in that column.
  - Made the column `namaDesa` on table `MasjidMNBaru` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Masjid" ALTER COLUMN "idKecamatan" DROP NOT NULL,
ALTER COLUMN "namaKecamatan" DROP NOT NULL,
ALTER COLUMN "idDesa" DROP NOT NULL,
ALTER COLUMN "namaDesa" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MasjidMNBaru" ALTER COLUMN "idKecamatan" SET NOT NULL,
ALTER COLUMN "namaKecamatan" SET NOT NULL,
ALTER COLUMN "idDesa" SET NOT NULL,
ALTER COLUMN "namaDesa" SET NOT NULL;
