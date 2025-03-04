/*
  Warnings:

  - The values [COMPELETED] on the enum `MaintenanceStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MaintenanceStatus_new" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELED');
ALTER TABLE "Maintenance" ALTER COLUMN "Status" DROP DEFAULT;
ALTER TABLE "Maintenance" ALTER COLUMN "Status" TYPE "MaintenanceStatus_new" USING ("Status"::text::"MaintenanceStatus_new");
ALTER TYPE "MaintenanceStatus" RENAME TO "MaintenanceStatus_old";
ALTER TYPE "MaintenanceStatus_new" RENAME TO "MaintenanceStatus";
DROP TYPE "MaintenanceStatus_old";
ALTER TABLE "Maintenance" ALTER COLUMN "Status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "Maintenance" ADD COLUMN     "canceledBy" TEXT;
