-- DropIndex
DROP INDEX "User_email_username_key";

-- DropIndex
DROP INDEX "User_Role_user_id_key";

-- AlterTable
ALTER TABLE "User_Role" ALTER COLUMN "role" SET DEFAULT 'READER';
