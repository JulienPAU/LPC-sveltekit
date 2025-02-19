-- CreateEnum
CREATE TYPE "ModeratorRequest" AS ENUM ('NOT_REQUESTED', 'PENDING', 'APPROVED', 'REJECTED', 'DECLINED');

-- DropForeignKey
ALTER TABLE "Articles" DROP CONSTRAINT "Articles_user_id_fkey";

-- AlterTable
ALTER TABLE "Articles" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "moderatorRequestAt" TIMESTAMP(3),
ADD COLUMN     "moderatorRequestStatus" "ModeratorRequest" DEFAULT 'NOT_REQUESTED';

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
