/*
  Warnings:

  - Added the required column `billingMonth` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "billingMonth" TEXT NOT NULL;
