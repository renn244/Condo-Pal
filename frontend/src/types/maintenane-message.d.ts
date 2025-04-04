
const SenderType = {
    WORKER: 'WORKER',
    CLIENT: 'CLIENT',
    ADMIN: 'ADMIN',
} as const;

type SenderType = typeof SenderType[keyof typeof SenderType];

type MaintenanceMessage = {
    id: string;

    maintenanceId: string;

    senderId: string;

    workerName?: string;
    senderType: SenderType;

    message: string;
    attachment: string[];

    isStatusUpdate?: boolean;

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