-- DropForeignKey
ALTER TABLE "ArticleTags" DROP CONSTRAINT "ArticleTags_article_id_fkey";

-- DropForeignKey
ALTER TABLE "ArticleTags" DROP CONSTRAINT "ArticleTags_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "ArticleWatches" DROP CONSTRAINT "ArticleWatches_article_id_fkey";

-- DropForeignKey
ALTER TABLE "ArticleWatches" DROP CONSTRAINT "ArticleWatches_watch_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Role" DROP CONSTRAINT "User_Role_user_id_fkey";

-- AddForeignKey
ALTER TABLE "ArticleTags" ADD CONSTRAINT "ArticleTags_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleTags" ADD CONSTRAINT "ArticleTags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Role" ADD CONSTRAINT "User_Role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleWatches" ADD CONSTRAINT "ArticleWatches_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleWatches" ADD CONSTRAINT "ArticleWatches_watch_id_fkey" FOREIGN KEY ("watch_id") REFERENCES "Watches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
