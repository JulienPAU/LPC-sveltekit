/*
  Warnings:

  - You are about to drop the `ArticleImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ArticleImage" DROP CONSTRAINT "ArticleImage_article_id_fkey";

-- AlterTable
ALTER TABLE "Articles" ADD COLUMN     "images" JSONB[];

-- DropTable
DROP TABLE "ArticleImage";
