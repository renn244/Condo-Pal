-- CreateTable
CREATE TABLE "UserPayout" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "availableAmount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPayout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payouts" (
    "id" TEXT NOT NULL,
    "userPayoutId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPayout_userId_key" ON "UserPayout"("userId");

-- AddForeignKey
ALTER TABLE "UserPayout" ADD CONSTRAINT "UserPayout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payouts" ADD CONSTRAINT "Payouts_userPayoutId_fkey" FOREIGN KEY ("userPayoutId") REFERENCES "UserPayout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
