-- CreateTable
CREATE TABLE "MaintenanceWorkerToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "workerName" TEXT,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaintenanceWorkerToken_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MaintenanceWorkerToken" ADD CONSTRAINT "MaintenanceWorkerToken_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "Maintenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
