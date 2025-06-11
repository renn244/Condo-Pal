/*
  Warnings:

  - Added the required column `payoutMethodId` to the `Payouts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payouts" ADD COLUMN     "payoutMethodId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Payouts" ADD CONSTRAINT "Payouts_payoutMethodId_fkey" FOREIGN KEY ("payoutMethodId") REFERENCES "PayoutMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
