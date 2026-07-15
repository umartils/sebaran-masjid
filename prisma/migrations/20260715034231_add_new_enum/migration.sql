/*
  Warnings:

  - The values [APPROVED] on the enum `ProgresStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "BuildingStatus" ADD VALUE 'ON_AIR';

-- AlterEnum
BEGIN;
CREATE TYPE "ProgresStatus_new" AS ENUM ('ON_PROGRESS', 'SELESAI');
ALTER TABLE "public"."TrackingMasjid" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "TrackingMasjid" ALTER COLUMN "status" TYPE "ProgresStatus_new" USING ("status"::text::"ProgresStatus_new");
ALTER TYPE "ProgresStatus" RENAME TO "ProgresStatus_old";
ALTER TYPE "ProgresStatus_new" RENAME TO "ProgresStatus";
DROP TYPE "public"."ProgresStatus_old";
ALTER TABLE "TrackingMasjid" ALTER COLUMN "status" SET DEFAULT 'ON_PROGRESS';
COMMIT;
