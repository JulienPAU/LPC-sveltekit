/*
  Warnings:

  - The `case_material` column on the `Watches` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "WatchCaseMaterial" AS ENUM ('STAINLESS_STEEL_316L', 'TITANIUM', 'GOLD', 'PLATINUM', 'CERAMIC', 'CARBON', 'BRONZE', 'PLASTIC', 'ALUMINUM', 'PALLADIUM', 'TUNGSTEN', 'SILVER', 'COPPER', 'MAGNESIUM');

-- AlterTable
ALTER TABLE "Watches" DROP COLUMN "case_material",
ADD COLUMN     "case_material" "WatchCaseMaterial";
