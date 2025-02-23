-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "linkId" DROP NOT NULL;
