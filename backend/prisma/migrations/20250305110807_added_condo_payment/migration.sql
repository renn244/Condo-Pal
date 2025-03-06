-- CreateEnum
CREATE TYPE "CondoPaymentType" AS ENUM ('PAYMONGO', 'GCASH', 'MANUAL');

-- CreateEnum
CREATE TYPE "GcashPaymentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "CondoPayment" (
    "id" TEXT NOT NULL,
    "type" "CondoPaymentType" NOT NULL,
    "rentCost" INTEGER NOT NULL,
    "additionalCost" INTEGER DEFAULT 0,
    "totalPaid" INTEGER NOT NULL,
    "linkId" TEXT,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "tenantId" TEXT NOT NULL,
    "condoId" TEXT NOT NULL,
    "receiptImage" TEXT,
    "isVerified" BOOLEAN,
    "gcashStatus" "GcashPaymentStatus",
    "payedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CondoPayment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CondoPayment" ADD CONSTRAINT "CondoPayment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CondoPayment" ADD CONSTRAINT "CondoPayment_condoId_fkey" FOREIGN KEY ("condoId") REFERENCES "Condo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
