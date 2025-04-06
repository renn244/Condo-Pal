-- CreateEnum
CREATE TYPE "MaintenanceMessageStatusUpdate" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'NOT_COMPLETED');

-- AlterTable
ALTER TABLE "MaintenanceMessage" ADD COLUMN     "statusUpdate" "MaintenanceMessageStatusUpdate";
