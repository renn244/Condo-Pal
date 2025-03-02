/*
  Warnings:

  - Changed the type of `Status` on the `Maintinance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `priorityLevel` on the `Maintinance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `paymentResponsibility` on the `Maintinance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPELETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "PriorityLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "PaymentResponsibility" AS ENUM ('TENANT', 'LANDLORD');

-- AlterTable
ALTER TABLE "Maintinance" DROP COLUMN "Status",
ADD COLUMN     "Status" "MaintenanceStatus" NOT NULL,
DROP COLUMN "priorityLevel",
ADD COLUMN     "priorityLevel" "PriorityLevel" NOT NULL,
DROP COLUMN "paymentResponsibility",
ADD COLUMN     "paymentResponsibility" "PaymentResponsibility" NOT NULL;
