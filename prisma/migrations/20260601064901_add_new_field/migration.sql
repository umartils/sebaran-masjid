-- AlterTable
ALTER TABLE "TrackingMasjidLog" ADD COLUMN     "waktuProgres" TEXT,
ALTER COLUMN "nextProgres" DROP NOT NULL;
