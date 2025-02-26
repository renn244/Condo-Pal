/*
  Warnings:

  - A unique constraint covering the columns `[id,ownerId]` on the table `Condo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Condo_id_ownerId_key" ON "Condo"("id", "ownerId");
