-- CreateTable
CREATE TABLE IF NOT EXISTS "_MaintenancePayments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "_MaintenancePayments_AB_unique" ON "_MaintenancePayments"("A", "B");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "_MaintenancePayments_B_index" ON "_MaintenancePayments"("B");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = '_MaintenancePayments_A_fkey'
          AND conrelid = '"_MaintenancePayments"'::regclass
    ) THEN
        ALTER TABLE "_MaintenancePayments"
        ADD CONSTRAINT "_MaintenancePayments_A_fkey"
        FOREIGN KEY ("A") REFERENCES "CondoPayment"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$$;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = '_MaintenancePayments_B_fkey'
          AND conrelid = '"_MaintenancePayments"'::regclass
    ) THEN
        ALTER TABLE "_MaintenancePayments"
        ADD CONSTRAINT "_MaintenancePayments_B_fkey"
        FOREIGN KEY ("B") REFERENCES "Maintenance"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$$;
