/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Articles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Articles" ADD COLUMN     "slug" TEXT;

-- Fill slug values for existing articles
UPDATE "Articles" SET "slug" = LOWER(REPLACE(REPLACE(REPLACE(REPLACE(title, ' ', '-'), '.', ''), ',', ''), ':', '')) || '-' || id WHERE "slug" IS NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Articles_slug_key" ON "Articles"("slug");
