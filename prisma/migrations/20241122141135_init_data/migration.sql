/*
  Warnings:

  - Changed the type of `type` on the `Watches` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Tags_Name" AS ENUM ('SPORT', 'CASUAL', 'DRESS', 'MILITARY', 'DIVER', 'PILOT', 'CONNECTED', 'CHRONOGRAPH', 'LUXURY', 'OTHER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Article_Type" ADD VALUE 'REVIEW';
ALTER TYPE "Article_Type" ADD VALUE 'TECHNICAL';
ALTER TYPE "Article_Type" ADD VALUE 'LEXIQUE';

-- AlterTable
ALTER TABLE "Watches" DROP COLUMN "type",
ADD COLUMN     "type" "Category" NOT NULL;
