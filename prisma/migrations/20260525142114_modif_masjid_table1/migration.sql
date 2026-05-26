/*
  Warnings:

  - You are about to drop the column `namaRelawan` on the `Building` table. All the data in the column will be lost.
  - You are about to drop the column `noTelpRelawan` on the `Building` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Building" DROP COLUMN "namaRelawan",
DROP COLUMN "noTelpRelawan";
