/*
  Warnings:

  - You are about to drop the column `images` on the `Articles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Articles" DROP COLUMN "images",
ADD COLUMN     "update_date" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "ArticleImage" (
    "id" SERIAL NOT NULL,
    "article_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,

    CONSTRAINT "ArticleImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ArticleImage_article_id_idx" ON "ArticleImage"("article_id");

-- AddForeignKey
ALTER TABLE "ArticleImage" ADD CONSTRAINT "ArticleImage_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
