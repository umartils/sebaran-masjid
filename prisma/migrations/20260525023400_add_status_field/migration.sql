-- CreateEnum
CREATE TYPE "BuildingStatus" AS ENUM ('APPROVED', 'PENDING', 'REJECTED');

-- AlterTable
ALTER TABLE "Building" ADD COLUMN     "buildingStatus" "BuildingStatus" NOT NULL DEFAULT 'PENDING';
