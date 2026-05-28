-- AlterTable
ALTER TABLE "Building" ALTER COLUMN "condition" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Masjid" ALTER COLUMN "kondisi" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MasjidMN" ALTER COLUMN "condition" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MasjidMNBaru" ALTER COLUMN "kondisi" DROP NOT NULL;
