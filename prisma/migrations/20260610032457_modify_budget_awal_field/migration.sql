/*
  Warnings:

  - You are about to alter the column `budgetAwal` on the `Masjid` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Masjid" ALTER COLUMN "budgetAwal" SET DATA TYPE DOUBLE PRECISION;
