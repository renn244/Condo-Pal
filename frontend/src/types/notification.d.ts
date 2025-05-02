

const NotificationType = {
    MAINTENANCE: 'MAINTENANCE',
    PAYMENT: 'PAYMENT',
    EXPENSE: 'EXPENSE',
    MESSAGE: 'MESSAGE',
    LEASE: 'LEASE_AGREEMENT',
    SUBSCRIPTION: 'SUBSCRIPTION',
} as const;
type NotificationType = typeof NotificationType[keyof typeof NotificationType];

type notification = {
    id: string;
    userId: string;

    type: NotificationType;

    title: string;
    message: string;
    isRead: boolean;

    link?: string;

    createdAt: string;
    updatedAt: string;
}

type notifications = notification[];

type getNotifications = {
    notifications: notifications;
    unreadCount: number;
    nextCursor: string | null;
}