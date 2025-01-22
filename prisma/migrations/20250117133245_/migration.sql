/*
  Warnings:

  - You are about to drop the column `content` on the `Articles` table. All the data in the column will be lost.
  - You are about to drop the `ArticlesSubmitted` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'SUBMITTED';

-- DropForeignKey
ALTER TABLE "ArticlesSubmitted" DROP CONSTRAINT "ArticlesSubmitted_category_id_fkey";

-- DropForeignKey
ALTER TABLE "ArticlesSubmitted" DROP CONSTRAINT "ArticlesSubmitted_user_id_fkey";

-- AlterTable
ALTER TABLE "Articles" DROP COLUMN "content",
ADD COLUMN     "body" TEXT,
ADD COLUMN     "ending" TEXT,
ADD COLUMN     "introduction" TEXT,
ADD COLUMN     "submit_date" TIMESTAMP(3),
ALTER COLUMN "publish_date" DROP NOT NULL;

-- DropTable
DROP TABLE "ArticlesSubmitted";
