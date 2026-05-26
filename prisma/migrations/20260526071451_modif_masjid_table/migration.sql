/*
  Warnings:

  - Made the column `nama` on table `Masjid` required. This step will fail if there are existing NULL values in that column.
  - Made the column `alamat` on table `Masjid` required. This step will fail if there are existing NULL values in that column.
  - Made the column `idProvinsi` on table `Masjid` required. This step will fail if there are existing NULL values in that column.
  - Made the column `namaProvinsi` on table `Masjid` required. This step will fail if there are existing NULL values in that column.
  - Made the column `idKota` on table `Masjid` required. This step will fail if there are existing NULL values in that column.
  - Made the column `namaKota` on table `Masjid` required. This step will fail if there are existing NULL values in that column.
  - Made the column `idKecamatan` on table `Masjid` required. This step will fail if there are existing NULL values in that column.
  - Made the column `namaKecamatan` on table `Masjid` required. This step will fail if there are existing NULL values in that column.
  - Made the column `idDesa` on table `Masjid` required. This step will fail if there are existing NULL values in that column.
  - Made the column `namaDesa` on table `Masjid` required. This step will fail if there are existing NULL values in that column.
  - Made the column `latitude` on table `Masjid` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `Masjid` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nama` on table `MasjidMNBaru` required. This step will fail if there are existing NULL values in that column.
  - Made the column `alamat` on table `MasjidMNBaru` required. This step will fail if there are existing NULL values in that column.
  - Made the column `idProvinsi` on table `MasjidMNBaru` required. This step will fail if there are existing NULL values in that column.
  - Made the column `namaProvinsi` on table `MasjidMNBaru` required. This step will fail if there are existing NULL values in that column.
  - Made the column `idKota` on table `MasjidMNBaru` required. This step will fail if there are existing NULL values in that column.
  - Made the column `namaKota` on table `MasjidMNBaru` required. This step will fail if there are existing NULL values in that column.
  - Made the column `idKecamatan` on table `MasjidMNBaru` required. This step will fail if there are existing NULL values in that column.
  - Made the column `namaKecamatan` on table `MasjidMNBaru` required. This step will fail if there are existing NULL values in that column.
  - Made the column `idDesa` on table `MasjidMNBaru` required. This step will fail if there are existing NULL values in that column.
  - Made the column `namaDesa` on table `MasjidMNBaru` required. This step will fail if there are existing NULL values in that column.
  - Made the column `latitude` on table `MasjidMNBaru` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `MasjidMNBaru` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Masjid" ALTER COLUMN "nama" SET NOT NULL,
ALTER COLUMN "alamat" SET NOT NULL,
ALTER COLUMN "idProvinsi" SET NOT NULL,
ALTER COLUMN "namaProvinsi" SET NOT NULL,
ALTER COLUMN "idKota" SET NOT NULL,
ALTER COLUMN "namaKota" SET NOT NULL,
ALTER COLUMN "idKecamatan" SET NOT NULL,
ALTER COLUMN "namaKecamatan" SET NOT NULL,
ALTER COLUMN "idDesa" SET NOT NULL,
ALTER COLUMN "namaDesa" SET NOT NULL,
ALTER COLUMN "latitude" SET NOT NULL,
ALTER COLUMN "longitude" SET NOT NULL;

-- AlterTable
ALTER TABLE "MasjidMNBaru" ALTER COLUMN "nama" SET NOT NULL,
ALTER COLUMN "alamat" SET NOT NULL,
ALTER COLUMN "idProvinsi" SET NOT NULL,
ALTER COLUMN "namaProvinsi" SET NOT NULL,
ALTER COLUMN "idKota" SET NOT NULL,
ALTER COLUMN "namaKota" SET NOT NULL,
ALTER COLUMN "idKecamatan" SET NOT NULL,
ALTER COLUMN "namaKecamatan" SET NOT NULL,
ALTER COLUMN "idDesa" SET NOT NULL,
ALTER COLUMN "namaDesa" SET NOT NULL,
ALTER COLUMN "latitude" SET NOT NULL,
ALTER COLUMN "longitude" SET NOT NULL;
