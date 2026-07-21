-- AlterTable
ALTER TABLE "TrackingMasjid" ADD COLUMN     "editedBy" TEXT,
ADD COLUMN     "startedBy" TEXT;

-- AlterTable
ALTER TABLE "TrackingMasjidLog" ADD COLUMN     "editedBy" TEXT;
