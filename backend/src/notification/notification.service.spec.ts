import { Logger } from '@nestjs/common';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  const prisma = {};
  const notificationQueue = {
    add: jest.fn(),
  };

  let service: NotificationService;

  beforeEach(() => {
    jest.clearAllMocks();
    notificationQueue.add.mockResolvedValue({ id: 'job-1' });
    service = new NotificationService(
      prisma as never,
      notificationQueue as never,
    );
  });

  it('queues a notification without making callers await it', () => {
    const result = service.sendNotificationToUser('user-1', {
      type: 'PAYMENT',
      title: 'Payment received',
      message: 'Your payment was received.',
      link: '/payments/1',
    });

    expect(result).toBeUndefined();
    expect(notificationQueue.add).toHaveBeenCalledWith('process', {
      userId: 'user-1',
      type: 'PAYMENT',
      title: 'Payment received',
      message: 'Your payment was received.',
      link: '/payments/1',
    });
  });

  it('does not queue a notification without a recipient', () => {
    service.sendNotificationToUser(undefined, {
      type: 'PAYMENT',
      title: 'Payment received',
      message: 'Your payment was received.',
    });

    expect(notificationQueue.add).not.toHaveBeenCalled();
  });

  it('owns and logs an asynchronous queue rejection', async () => {
    const queueError = new Error('Redis unavailable');
    const loggerError = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);
    notificationQueue.add.mockRejectedValue(queueError);

    expect(() =>
      service.sendNotificationToUser('user-1', {
        type: 'PAYMENT',
        title: 'Payment received',
        message: 'Your payment was received.',
      }),
    ).not.toThrow();

    await new Promise<void>((resolve) => setImmediate(resolve));

    expect(loggerError).toHaveBeenCalledWith(
      'Failed to queue notification for user user-1',
      queueError.stack,
    );
  });
});
