/*
  Warnings:

  - The primary key for the `Favorites` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `expires` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `sessionToken` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Session` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `expiresAt` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Articles" DROP CONSTRAINT "Articles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ArticlesSubmitted" DROP CONSTRAINT "ArticlesSubmitted_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Favorites" DROP CONSTRAINT "Favorites_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_user_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Role" DROP CONSTRAINT "User_Role_user_id_fkey";

-- DropIndex
DROP INDEX "Session_sessionToken_key";

-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Articles" ALTER COLUMN "user_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ArticlesSubmitted" ALTER COLUMN "user_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Comments" ALTER COLUMN "user_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Favorites" DROP CONSTRAINT "Favorites_pkey",
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Favorites_pkey" PRIMARY KEY ("user_id", "article_id");

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "expires",
DROP COLUMN "sessionToken",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "authProvider" TEXT,
ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "User_Role" ALTER COLUMN "user_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticlesSubmitted" ADD CONSTRAINT "ArticlesSubmitted_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Role" ADD CONSTRAINT "User_Role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
