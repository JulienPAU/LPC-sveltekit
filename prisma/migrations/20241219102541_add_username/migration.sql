/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.

ALTER TYPE "RoleType" ADD VALUE 'AUTHOR';
ALTER TYPE "RoleType" ADD VALUE 'READER';
ALTER TYPE "RoleType" ADD VALUE 'EXPERT';

-- AlterTable
ALTER TABLE "User" ADD COLUMN "username" TEXT;

-- Mettre à jour les données existantes avec une valeur temporaire
UPDATE "User" SET "username" = CONCAT('user_', "id");

-- Rendre la colonne obligatoire (NOT NULL)
ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_username_key" ON "User"("email", "username");
