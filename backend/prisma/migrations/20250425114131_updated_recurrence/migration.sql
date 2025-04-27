/*
  Warnings:

  - The values [ONE_TIME,QUERTERLY] on the enum `Recurrence` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Recurrence_new" AS ENUM ('MONTHLY', 'QUARTERLY', 'YEARLY');
ALTER TABLE "Expense" ALTER COLUMN "recurrence" TYPE "Recurrence_new" USING ("recurrence"::text::"Recurrence_new");
ALTER TYPE "Recurrence" RENAME TO "Recurrence_old";
ALTER TYPE "Recurrence_new" RENAME TO "Recurrence";
DROP TYPE "Recurrence_old";
COMMIT;
