
const MaintenanceStatus = {
    PENDING: "PENDING",
    SCHEDULED: "SCHEDULED",
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETED: "COMPLETED",
    CANCELED: "CANCELED"
} as const

const PriorityLevel = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
} as const

const PaymentResponsibility = {
    TENANT: "TENANT",
    LANDLORD: "LANDLORD"
} as const

const MaintenanceType = {
    CORRECTIVE: "CORRECTIVE",
    PREVENTIVE: "PREVENTIVE",
    EMERGENCY: "EMERGENCY"
} as const

type MaintenanceStatus = typeof MaintenanceStatus[keyof typeof MaintenanceStatus];
type PriorityLevel = typeof PriorityLevel[keyof typeof PriorityLevel];
type PaymentResponsibility = typeof PaymentResponsibility[keyof typeof PaymentResponsibility];
type MaintenanceType = typeof MaintenanceType[keyof typeof MaintenanceType];

type maintenance = {
    id: string,

    condoId: string,

    photos: string[],
    title: string,
    description: string,

    type: MaintenanceType,
    Status: MaintenanceStatus,
    priorityLevel: PriorityLevel,

    estimatedCost?: number,
    totalCost?: number,

    canceledBy?: string,
    paymentResponsibility?: PaymentResponsibility,

    // messages // add later

    preferredSchedule?: string,
    scheduledDate?: string,
    completionDate?: string,
    proofOfCompletion: string[],

    createdAt: string,
}

type maintenanceCard = {
    condo: {
        id: condo['id'],
        name: condo['name'],
        address: condo['address']
    }
} & maintenance

type MaintenanceRequest = {
    maintenanceRequests: maintenanceCard[],
    hasNext: boolean,
    totalPages: number
}

type MaintenanceGetRequest = {
    condo: {
        id: condo['id'],
        name: condo['name'],
        address: condo['address']
        tenantId: condo['tenantId'],
        tenant: {
            name: user['name'],
            profile: user['profile']
        },
        ownerId: condo['ownerId'],
        owner: {
            name: user['name'],
            profile: user['profile']
        }
    }
} & maintenance

type MaintenanceRequestStats = {
    costDistributionStats: {
        month: string,
        landlord: number,
        tenant: number,
    }[],
    statusStatistics: {
        status: "Pending" | "Scheduled" | "In Progress" | "Completed" | "Canceled",
        value: number,
    }[],
    totalRequests: number,
    pendingMaintenances: maintenance[],
}