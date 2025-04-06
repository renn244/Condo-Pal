/*
  Warnings:

  - A unique constraint covering the columns `[token,maintenanceId]` on the table `MaintenanceWorkerToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MaintenanceWorkerToken_token_maintenanceId_key" ON "MaintenanceWorkerToken"("token", "maintenanceId");
