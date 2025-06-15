-- AlterTable
ALTER TABLE "CondoPayment" ADD COLUMN     "expensesCost" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "maintenanceCost" INTEGER NOT NULL DEFAULT 0;
