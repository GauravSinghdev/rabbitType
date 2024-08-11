-- CreateTable
CREATE TABLE "TypingTest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "timer" TEXT NOT NULL,
    "wpm" INTEGER NOT NULL,
    "rawWpm" INTEGER NOT NULL,
    "mistakes" INTEGER NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "backspaceCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TypingTest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TypingTest" ADD CONSTRAINT "TypingTest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
