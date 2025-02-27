/*
  Warnings:

  - A unique constraint covering the columns `[tenantId]` on the table `Condo` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Condo" ADD COLUMN     "tenantId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Condo_tenantId_key" ON "Condo"("tenantId");

-- AddForeignKey
ALTER TABLE "Condo" ADD CONSTRAINT "Condo_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
