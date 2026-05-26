/*
  Warnings:

  - The `kondisi` column on the `MasjidMNBaru` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "MasjidMNBaru" DROP COLUMN "kondisi",
ADD COLUMN     "kondisi" TEXT;
