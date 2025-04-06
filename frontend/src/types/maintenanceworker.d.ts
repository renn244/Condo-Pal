
type maintenanceWorker = {
    id: string;
    token: string;
    workerName: string | null;
    used: boolean;
    maintenanceId: string;

    createdAt: Date;
}