-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Relawan', 'Admin');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'Relawan';
