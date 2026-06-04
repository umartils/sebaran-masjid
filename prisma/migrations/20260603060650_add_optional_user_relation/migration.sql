-- AlterTable
ALTER TABLE "Masjid" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Masjid" ADD CONSTRAINT "Masjid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
