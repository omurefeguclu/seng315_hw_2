-- CreateTable
CREATE TABLE "UserScore" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserScore_username_key" ON "UserScore"("username");
