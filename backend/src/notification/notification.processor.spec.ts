import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { NotificationProcessor } from './notification.processor';

describe('NotificationProcessor', () => {
  const notification = {
    id: 'notification-1',
    userId: 'user-1',
    type: 'PAYMENT',
    title: 'Payment received',
    message: 'Your payment was received.',
    link: null,
  };
  const prisma = {
    notification: {
      create: jest.fn(),
    },
  };
  const emit = jest.fn();
  const generalGateway = {
    getSocketIdByUserId: jest.fn(),
    io: {
      to: jest.fn(() => ({ emit })),
    },
  };

  let processor: NotificationProcessor;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.notification.create.mockResolvedValue(notification);
    generalGateway.getSocketIdByUserId.mockReturnValue('socket-1');
    processor = new NotificationProcessor(
      prisma as never,
      generalGateway as never,
    );
  });

  it('persists and emits a notification', async () => {
    const result = await processor.process({
      data: {
        userId: 'user-1',
        type: 'PAYMENT',
        title: 'Payment received',
        message: 'Your payment was received.',
        link: undefined,
      },
    } as Job);

    expect(prisma.notification.create).toHaveBeenCalled();
    expect(emit).toHaveBeenCalledWith('newNotification', notification);
    expect(result).toEqual({ success: true });
  });

  it('does not retry a persisted notification when socket delivery fails', async () => {
    const socketError = new Error('Socket unavailable');
    const loggerError = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);
    emit.mockImplementation(() => {
      throw socketError;
    });

    await expect(
      processor.process({
        data: {
          userId: 'user-1',
          type: 'PAYMENT',
          title: 'Payment received',
          message: 'Your payment was received.',
        },
      } as Job),
    ).resolves.toEqual({ success: true });

    expect(loggerError).toHaveBeenCalledWith(
      'Failed to emit notification notification-1 to user user-1',
      socketError.stack,
    );
  });

  it('throws database failures so BullMQ can retry the job', async () => {
    const databaseError = new Error('Database unavailable');
    prisma.notification.create.mockRejectedValue(databaseError);

    await expect(
      processor.process({
        data: {
          userId: 'user-1',
          type: 'PAYMENT',
          title: 'Payment received',
          message: 'Your payment was received.',
        },
      } as Job),
    ).rejects.toThrow(databaseError);
  });
});
