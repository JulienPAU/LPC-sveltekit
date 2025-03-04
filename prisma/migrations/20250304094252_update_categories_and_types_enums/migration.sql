-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Article_Type" ADD VALUE 'VINTAGE';
ALTER TYPE "Article_Type" ADD VALUE 'SPONSORED';
ALTER TYPE "Article_Type" ADD VALUE 'INTERVIEW';
ALTER TYPE "Article_Type" ADD VALUE 'COMPARISON';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Category" ADD VALUE 'AUTOMATIC';
ALTER TYPE "Category" ADD VALUE 'DIVER';
ALTER TYPE "Category" ADD VALUE 'PILOT';
ALTER TYPE "Category" ADD VALUE 'POCKET';
ALTER TYPE "Category" ADD VALUE 'DRESS';
ALTER TYPE "Category" ADD VALUE 'FIELD';
ALTER TYPE "Category" ADD VALUE 'TOURBILLON';
ALTER TYPE "Category" ADD VALUE 'MECHANICAL';
ALTER TYPE "Category" ADD VALUE 'SOLAR';
ALTER TYPE "Category" ADD VALUE 'SKELETON';
