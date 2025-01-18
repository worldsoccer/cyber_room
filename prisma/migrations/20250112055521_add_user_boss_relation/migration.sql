/*
  Warnings:

  - Added the required column `authorId` to the `Boss` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Boss` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Boss" ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Boss" ADD CONSTRAINT "Boss_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
