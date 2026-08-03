-- CreateTable
CREATE TABLE "TokenUsage" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "userId" TEXT,
    "anonId" TEXT,
    "ipAddress" TEXT,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "totalTokens" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TokenUsage_date_idx" ON "TokenUsage"("date");

-- CreateIndex
CREATE UNIQUE INDEX "TokenUsage_userId_date_key" ON "TokenUsage"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "TokenUsage_anonId_date_key" ON "TokenUsage"("anonId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "TokenUsage_ipAddress_date_key" ON "TokenUsage"("ipAddress", "date");

-- AddForeignKey
ALTER TABLE "TokenUsage" ADD CONSTRAINT "TokenUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
