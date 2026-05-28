/*
  Warnings:

  - You are about to drop the column `approvedBy` on the `Masjid` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Masjid" DROP COLUMN "approvedBy",
ADD COLUMN     "editedBy" TEXT;
