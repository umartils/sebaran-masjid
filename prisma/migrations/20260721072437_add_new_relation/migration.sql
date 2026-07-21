/*
  Warnings:

  - You are about to drop the column `startedBy` on the `TrackingMasjid` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TrackingMasjid" DROP COLUMN "startedBy",
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "TrackingMasjid" ADD CONSTRAINT "TrackingMasjid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
