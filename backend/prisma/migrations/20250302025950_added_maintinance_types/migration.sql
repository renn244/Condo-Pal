/*
  Warnings:

  - Added the required column `type` to the `Maintinance` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MaintinanceType" AS ENUM ('CORRECTIVE', 'PREVENTIVE', 'EMERGENCY');

-- AlterTable
ALTER TABLE "Maintinance" ADD COLUMN     "type" "MaintinanceType" NOT NULL;
