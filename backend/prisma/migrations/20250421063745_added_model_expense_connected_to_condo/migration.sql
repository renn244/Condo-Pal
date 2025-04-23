-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('UTILITY', 'ASSOCIATION', 'CLEANING', 'OTHER');

-- CreateEnum
CREATE TYPE "Recurrence" AS ENUM ('ONE_TIME', 'MONTHLY', 'QUERTERLY', 'YEARLY');

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "condoId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "category" "ExpenseCategory" NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "recurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrence" "Recurrence" NOT NULL DEFAULT 'ONE_TIME',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_condoId_fkey" FOREIGN KEY ("condoId") REFERENCES "Condo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
