/*
  Warnings:

  - Made the column `kondisi` on table `Masjid` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Masjid" ALTER COLUMN "kondisi" SET NOT NULL;
