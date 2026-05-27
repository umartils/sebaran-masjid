-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Pelosok_Pedalaman', 'Muslim_Minoritas', 'Kampung_Mualaf', 'Terdampak_Bencana');

-- AlterTable
ALTER TABLE "Masjid" ADD COLUMN     "kategori" "Category" NOT NULL DEFAULT 'Pelosok_Pedalaman';

-- AlterTable
ALTER TABLE "MasjidMNBaru" ADD COLUMN     "kategori" "Category" NOT NULL DEFAULT 'Pelosok_Pedalaman';
