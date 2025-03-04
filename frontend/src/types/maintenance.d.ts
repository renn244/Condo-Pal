
const MaintenanceStatus = {
    PENDING: "PENDING",
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

    preferredSchedule?: string,
    completionDate?: string,
    createdAt: string,
}

type maintenanceCard = {
    condo: {
        id: condo['id'],
        name: condo['name'],
        address: condo['address']
    }
} & maintenance