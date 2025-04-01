export const MaintenanceStatus = {
    PENDING: "PENDING",
    SCHEDULED: "SCHEDULED",
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETED: "COMPLETED",
    CANCELED: "CANCELED"
} as const

export const PriorityLevel = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
} as const

export const PaymentResponsibility = {
    TENANT: "TENANT",
    LANDLORD: "LANDLORD"
} as const

export const MaintenanceType = {
    CORRECTIVE: "CORRECTIVE",
    PREVENTIVE: "PREVENTIVE",
    EMERGENCY: "EMERGENCY"
} as const