-- CreateTable
CREATE TABLE "Maintinance" (
    "id" TEXT NOT NULL,
    "condoId" TEXT NOT NULL,
    "photos" TEXT[],
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "Status" TEXT NOT NULL,
    "priorityLevel" TEXT NOT NULL,
    "estimatedCost" INTEGER NOT NULL,
    "totalCost" INTEGER,
    "paymentResponsibility" TEXT NOT NULL,
    "preferredSchedule" TIMESTAMP(3),
    "completionDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Maintinance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Maintinance" ADD CONSTRAINT "Maintinance_condoId_fkey" FOREIGN KEY ("condoId") REFERENCES "Condo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
