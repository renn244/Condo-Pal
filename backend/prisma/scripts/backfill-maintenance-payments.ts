import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const shouldApply = process.argv.includes('--apply');

type BackfillResult = {
  paymentId: string;
  condoId: string;
  billingMonth: string;
  maintenanceCost: number;
  candidateCost: number;
  candidateIds: string[];
  outcome: 'matched' | 'already-linked' | 'skipped';
  reason?: string;
};

function getMonthRange(billingMonth: string) {
  const match = /^(0[1-9]|1[0-2])-(\d{4})$/.exec(billingMonth);
  if (!match) return null;

  const month = Number(match[1]);
  const year = Number(match[2]);

  return {
    start: new Date(Date.UTC(year, month - 1, 1)),
    end: new Date(Date.UTC(year, month, 1)),
  };
}

async function main() {
  const payments = await prisma.condoPayment.findMany({
    where: {
      isPaid: true,
      maintenanceCost: { gt: 0 },
    },
    select: {
      id: true,
      condoId: true,
      billingMonth: true,
      maintenanceCost: true,
      maintenances: { select: { id: true } },
    },
    orderBy: { payedAt: 'asc' },
  });

  const duplicateMonths = new Set<string>();
  const paymentMonthCounts = new Map<string, number>();

  for (const payment of payments) {
    const key = `${payment.condoId}:${payment.billingMonth}`;
    paymentMonthCounts.set(key, (paymentMonthCounts.get(key) ?? 0) + 1);
  }

  for (const [key, count] of paymentMonthCounts) {
    if (count > 1) duplicateMonths.add(key);
  }

  const claimedMaintenanceIds = new Set<string>();
  const results: BackfillResult[] = [];

  for (const payment of payments) {
    const baseResult = {
      paymentId: payment.id,
      condoId: payment.condoId,
      billingMonth: payment.billingMonth,
      maintenanceCost: payment.maintenanceCost,
    };

    if (payment.maintenances.length > 0) {
      payment.maintenances.forEach(({ id }) => claimedMaintenanceIds.add(id));
      results.push({
        ...baseResult,
        candidateCost: payment.maintenanceCost,
        candidateIds: payment.maintenances.map(({ id }) => id),
        outcome: 'already-linked',
      });
      continue;
    }

    const monthRange = getMonthRange(payment.billingMonth);
    if (!monthRange) {
      results.push({
        ...baseResult,
        candidateCost: 0,
        candidateIds: [],
        outcome: 'skipped',
        reason: 'invalid billing month',
      });
      continue;
    }

    const monthKey = `${payment.condoId}:${payment.billingMonth}`;
    if (duplicateMonths.has(monthKey)) {
      results.push({
        ...baseResult,
        candidateCost: 0,
        candidateIds: [],
        outcome: 'skipped',
        reason: 'multiple paid records exist for this condo and billing month',
      });
      continue;
    }

    const candidates = await prisma.maintenance.findMany({
      where: {
        condoId: payment.condoId,
        paymentResponsibility: 'TENANT',
        completionDate: {
          gte: monthRange.start,
          lt: monthRange.end,
        },
      },
      select: { id: true, totalCost: true },
      orderBy: { completionDate: 'asc' },
    });

    const candidateIds = candidates.map(({ id }) => id);
    const candidateCost = candidates.reduce(
      (total, maintenance) => total + (maintenance.totalCost ?? 0),
      0,
    );
    const previouslyClaimed = candidateIds.filter((id) =>
      claimedMaintenanceIds.has(id),
    );

    if (candidateIds.length === 0 || candidateCost !== payment.maintenanceCost) {
      results.push({
        ...baseResult,
        candidateCost,
        candidateIds,
        outcome: 'skipped',
        reason:
          candidateIds.length === 0
            ? 'no matching maintenance records'
            : 'historical total does not exactly match candidate maintenance',
      });
      continue;
    }

    if (previouslyClaimed.length > 0) {
      results.push({
        ...baseResult,
        candidateCost,
        candidateIds,
        outcome: 'skipped',
        reason: `maintenance already claimed by another paid record: ${previouslyClaimed.join(', ')}`,
      });
      continue;
    }

    if (shouldApply) {
      await prisma.condoPayment.update({
        where: { id: payment.id },
        data: {
          maintenances: {
            connect: candidateIds.map((id) => ({ id })),
          },
        },
      });
    }

    candidateIds.forEach((id) => claimedMaintenanceIds.add(id));
    results.push({
      ...baseResult,
      candidateCost,
      candidateIds,
      outcome: 'matched',
    });
  }

  const summary = results.reduce(
    (counts, result) => {
      counts[result.outcome] += 1;
      return counts;
    },
    { matched: 0, 'already-linked': 0, skipped: 0 },
  );

  console.log(
    JSON.stringify(
      {
        mode: shouldApply ? 'apply' : 'dry-run',
        summary,
        skipped: results.filter(({ outcome }) => outcome === 'skipped'),
        matched: results.filter(({ outcome }) => outcome === 'matched'),
      },
      null,
      2,
    ),
  );

  if (summary.skipped > 0) {
    process.exitCode = 2;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
