import { CondoPaymentService } from './condo-payment.service';

describe('CondoPaymentService', () => {
  const prisma = {
    condo: {
      findUnique: jest.fn(),
    },
    maintenance: {
      findMany: jest.fn(),
    },
    condoPayment: {
      create: jest.fn(),
    },
  };
  const fileUploadService = {
    upload: jest.fn(),
  };
  const paymongoService = {};
  const notificationService = {
    sendNotificationToUser: jest.fn(),
  };

  let service: CondoPaymentService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CondoPaymentService(
      prisma as never,
      fileUploadService as never,
      paymongoService as never,
      notificationService as never,
    );
  });

  it('includes every completed tenant maintenance without a paid payment', async () => {
    jest
      .spyOn(service, 'getBillingMonth')
      .mockResolvedValue({ billingMonth: '08-2026', dueDate: '2026-08-10' });
    jest.spyOn(service, 'isPaymentAllowed').mockReturnValue(true);
    jest.spyOn(service, 'aggregateExpensesByBillingMonth').mockResolvedValue(500);
    prisma.condo.findUnique.mockResolvedValue({ rentAmount: 10_000 });
    prisma.maintenance.findMany.mockResolvedValue([
      {
        id: 'maintenance-old',
        title: 'Old repair',
        totalCost: 1_500,
        completionDate: new Date('2026-06-05T00:00:00.000Z'),
      },
      {
        id: 'maintenance-new',
        title: 'New repair',
        totalCost: 2_000,
        completionDate: new Date('2026-08-01T00:00:00.000Z'),
      },
    ]);

    const bill = await service.getTotalPayment('condo-1', {
      id: 'tenant-1',
    } as never);

    expect(prisma.maintenance.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          condoId: 'condo-1',
          Status: 'COMPLETED',
          paymentResponsibility: 'TENANT',
          totalCost: { not: null },
          payments: {
            none: { isPaid: true },
          },
        },
      }),
    );
    expect(bill.maintenanceCost).toBe(3_500);
    expect(bill.additionalCost).toBe(4_000);
    expect(bill.totalCost).toBe(14_000);
  });

  it('creates GCash payments from the server bill and links its maintenance items', async () => {
    jest.spyOn(service, 'getTotalPayment').mockResolvedValue({
      isPaymentAllowed: true,
      rentCost: 10_000,
      expensesCost: 500,
      maintenanceCost: 1_500,
      maintenanceItems: [
        {
          id: 'maintenance-1',
          title: 'Repair',
          totalCost: 1_500,
          completionDate: new Date(),
        },
      ],
      additionalCost: 2_000,
      totalCost: 12_000,
      billingMonth: '08-2026',
      dueDate: '2026-08-10',
    });
    fileUploadService.upload.mockResolvedValue({
      secure_url: 'https://example.com/receipt.jpg',
    });
    prisma.condoPayment.create.mockResolvedValue({
      id: 'payment-1',
      condo: { ownerId: 'owner-1', name: 'Unit 1' },
    });

    await service.createGcashPayment(
      { id: 'tenant-1', name: 'Tenant' } as never,
      'condo-1',
      {} as Express.Multer.File,
      {
        rentCost: '1',
        expensesCost: '1',
        maintenanceCost: '1',
        additionalCost: '1',
        totalPaid: '12000',
      },
    );

    expect(prisma.condoPayment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          rentCost: 10_000,
          expensesCost: 500,
          maintenanceCost: 1_500,
          additionalCost: 2_000,
          totalPaid: 12_000,
          maintenances: {
            connect: [{ id: 'maintenance-1' }],
          },
        }),
      }),
    );
  });
});
