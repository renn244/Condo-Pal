
const SenderType = {
    WORKER: 'WORKER',
    CLIENT: 'CLIENT',
    ADMIN: 'ADMIN',
} as const;

const StatusUpdate = {
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    NOT_COMPLETED: 'NOT_COMPLETED',
} as const;

type SenderType = typeof SenderType[keyof typeof SenderType];
type StatusUpdate = typeof StatusUpdate[keyof typeof StatusUpdate];

type MaintenanceMessage = {
    id: string;

    maintenanceId: string;

    senderId: string;

    workerName?: string;
    senderType: SenderType;

    message: string;
    attachment: string[];

    isStatusUpdate?: boolean;
    statusUpdate: StatusUpdate;

    createdAt: string;
}

type MaintenanceMessageWithSender = {
    sender: {
        id: user['id'];
        name: user['name'];
        profile: user['profile']
    }
} & MaintenanceMessage

type MaintenanceGetMessages = {
    messages: MaintenanceMessageWithSender[];
    nextCursor: string | null;
}