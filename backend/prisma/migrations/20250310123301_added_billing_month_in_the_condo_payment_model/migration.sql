/*
  Warnings:

  - Added the required column `billingMonth` to the `CondoPayment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CondoPayment" ADD COLUMN     "billingMonth" TEXT NOT NULL;
