-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Article_Type" ADD VALUE 'NEWS';
ALTER TYPE "Article_Type" ADD VALUE 'OTHER';

-- AlterEnum
ALTER TYPE "WatchCaseMaterial" ADD VALUE 'OTHER';

-- AlterTable
ALTER TABLE "Watches" ADD COLUMN     "case_size" TEXT,
ADD COLUMN     "glass" TEXT,
ADD COLUMN     "lug_to_lug" TEXT,
ADD COLUMN     "lug_width" TEXT,
ADD COLUMN     "thickness" TEXT;
