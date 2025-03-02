/*
  Warnings:

  - You are about to drop the `Maintinance` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('CORRECTIVE', 'PREVENTIVE', 'EMERGENCY');

-- DropForeignKey
ALTER TABLE "Maintinance" DROP CONSTRAINT "Maintinance_condoId_fkey";

-- DropTable
DROP TABLE "Maintinance";

-- DropEnum
DROP TYPE "MaintinanceType";

-- CreateTable
CREATE TABLE "Maintenance" (
    "id" TEXT NOT NULL,
    "condoId" TEXT NOT NULL,
    "photos" TEXT[],
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "MaintenanceType" NOT NULL,
    "Status" "MaintenanceStatus" NOT NULL DEFAULT 'PENDING',
    "priorityLevel" "PriorityLevel" NOT NULL,
    "estimatedCost" INTEGER,
    "totalCost" INTEGER,
    "paymentResponsibility" "PaymentResponsibility",
    "preferredSchedule" TIMESTAMP(3),
    "completionDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Maintenance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_condoId_fkey" FOREIGN KEY ("condoId") REFERENCES "Condo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
