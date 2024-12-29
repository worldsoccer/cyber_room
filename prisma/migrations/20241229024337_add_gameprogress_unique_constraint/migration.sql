/*
  Warnings:

  - A unique constraint covering the columns `[userId,folderId,mode]` on the table `GameProgress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `folderId` to the `GameProgress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mode` to the `GameProgress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameProgress" ADD COLUMN     "folderId" INTEGER NOT NULL,
ADD COLUMN     "mode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GameProgress_userId_folderId_mode_key" ON "GameProgress"("userId", "folderId", "mode");
