-- DropForeignKey
ALTER TABLE "Articles" DROP CONSTRAINT "Articles_category_id_fkey";

-- AlterTable
ALTER TABLE "Articles" ALTER COLUMN "category_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
