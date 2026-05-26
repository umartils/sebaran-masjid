/*
  Warnings:

  - You are about to drop the column `notes` on the `MasjidMNBaru` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MasjidMNBaru" DROP COLUMN "notes",
ADD COLUMN     "catatan" TEXT;
