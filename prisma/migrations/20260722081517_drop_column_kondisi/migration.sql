/*
  Warnings:

  - You are about to drop the column `kondisi` on the `Masjid` table. All the data in the column will be lost.
  - You are about to drop the column `kondisi` on the `MasjidMNBaru` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Masjid" DROP COLUMN "kondisi";

-- AlterTable
ALTER TABLE "MasjidMNBaru" DROP COLUMN "kondisi";
