-- AlterTable
ALTER TABLE "Expense" ALTER COLUMN "recurrence" DROP NOT NULL,
ALTER COLUMN "recurrence" DROP DEFAULT;
