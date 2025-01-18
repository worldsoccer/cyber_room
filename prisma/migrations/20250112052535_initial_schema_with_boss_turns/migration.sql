/*
  Warnings:

  - You are about to drop the `BattleLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TowerProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BossQuizzes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `attackTurn` to the `Boss` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Boss` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxHp` to the `Boss` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BattleLog" DROP CONSTRAINT "BattleLog_bossId_fkey";

-- DropForeignKey
ALTER TABLE "BattleLog" DROP CONSTRAINT "BattleLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "Floor" DROP CONSTRAINT "Floor_towerId_fkey";

-- DropForeignKey
ALTER TABLE "TowerProgress" DROP CONSTRAINT "TowerProgress_towerId_fkey";

-- DropForeignKey
ALTER TABLE "TowerProgress" DROP CONSTRAINT "TowerProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "_BossQuizzes" DROP CONSTRAINT "_BossQuizzes_A_fkey";

-- DropForeignKey
ALTER TABLE "_BossQuizzes" DROP CONSTRAINT "_BossQuizzes_B_fkey";

-- AlterTable
ALTER TABLE "Boss" ADD COLUMN     "attackTurn" INTEGER NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "maxHp" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Tower" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "attackPower" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "experience" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "healingPower" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "hp" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "maxHp" INTEGER NOT NULL DEFAULT 100;

-- DropTable
DROP TABLE "BattleLog";

-- DropTable
DROP TABLE "TowerProgress";

-- DropTable
DROP TABLE "_BossQuizzes";
