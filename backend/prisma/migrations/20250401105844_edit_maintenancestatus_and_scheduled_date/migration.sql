-- AlterEnum
ALTER TYPE "MaintenanceStatus" ADD VALUE 'SCHEDULED';

-- AlterTable
ALTER TABLE "Maintenance" ADD COLUMN     "scheduledDate" TIMESTAMP(3);
