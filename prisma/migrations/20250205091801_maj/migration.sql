/*
  Warnings:

  - You are about to drop the column `strap_material` on the `Watches` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Watches` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[brand,model]` on the table `Watches` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Watches" DROP COLUMN "strap_material",
DROP COLUMN "type",
ADD COLUMN     "category_id" INTEGER;

-- CreateTable
CREATE TABLE "Straps" (
    "id" SERIAL NOT NULL,
    "material" TEXT NOT NULL,

    CONSTRAINT "Straps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchStraps" (
    "watch_id" INTEGER NOT NULL,
    "strap_id" INTEGER NOT NULL,

    CONSTRAINT "WatchStraps_pkey" PRIMARY KEY ("watch_id","strap_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Watches_brand_model_key" ON "Watches"("brand", "model");

-- AddForeignKey
ALTER TABLE "Watches" ADD CONSTRAINT "Watches_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchStraps" ADD CONSTRAINT "WatchStraps_watch_id_fkey" FOREIGN KEY ("watch_id") REFERENCES "Watches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchStraps" ADD CONSTRAINT "WatchStraps_strap_id_fkey" FOREIGN KEY ("strap_id") REFERENCES "Straps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
