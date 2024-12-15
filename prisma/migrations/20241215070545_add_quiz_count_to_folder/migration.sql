-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "quizCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Tower" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Tower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Floor" (
    "id" SERIAL NOT NULL,
    "towerId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "difficulty" INTEGER NOT NULL,

    CONSTRAINT "Floor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TowerProgress" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "towerId" INTEGER NOT NULL,
    "currentFloor" INTEGER NOT NULL,
    "cleared" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TowerProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Boss" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "difficulty" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,
    "attackPower" INTEGER NOT NULL,

    CONSTRAINT "Boss_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BattleLog" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "bossId" INTEGER NOT NULL,
    "damageDealt" INTEGER NOT NULL,
    "damageTaken" INTEGER NOT NULL,
    "battleDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "result" TEXT NOT NULL,

    CONSTRAINT "BattleLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FloorQuizzes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BossQuizzes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FloorQuizzes_AB_unique" ON "_FloorQuizzes"("A", "B");

-- CreateIndex
CREATE INDEX "_FloorQuizzes_B_index" ON "_FloorQuizzes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BossQuizzes_AB_unique" ON "_BossQuizzes"("A", "B");

-- CreateIndex
CREATE INDEX "_BossQuizzes_B_index" ON "_BossQuizzes"("B");

-- AddForeignKey
ALTER TABLE "Floor" ADD CONSTRAINT "Floor_towerId_fkey" FOREIGN KEY ("towerId") REFERENCES "Tower"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TowerProgress" ADD CONSTRAINT "TowerProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TowerProgress" ADD CONSTRAINT "TowerProgress_towerId_fkey" FOREIGN KEY ("towerId") REFERENCES "Tower"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleLog" ADD CONSTRAINT "BattleLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleLog" ADD CONSTRAINT "BattleLog_bossId_fkey" FOREIGN KEY ("bossId") REFERENCES "Boss"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FloorQuizzes" ADD CONSTRAINT "_FloorQuizzes_A_fkey" FOREIGN KEY ("A") REFERENCES "Floor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FloorQuizzes" ADD CONSTRAINT "_FloorQuizzes_B_fkey" FOREIGN KEY ("B") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BossQuizzes" ADD CONSTRAINT "_BossQuizzes_A_fkey" FOREIGN KEY ("A") REFERENCES "Boss"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BossQuizzes" ADD CONSTRAINT "_BossQuizzes_B_fkey" FOREIGN KEY ("B") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
