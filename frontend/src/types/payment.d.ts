
const CondoPaymentType = {
    PAYMONGOL: "PAYMONGO",
    GCASH: "GCASH",
    MANUAL: "MANUAL",
} as const

const GcashPaymentStatus = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
} as const

type PaymentStatusResponse = {
    name: string,
    status: "pending" | "paid" | "failed" | "loading",
    linkId: string,
    checkouturl: string, // just in case the user want to go back to paying
}

type CondoPaymentType = typeof CondoPaymentType[keyof typeof CondoPaymentType];
type GcashPaymentStatus = typeof GcashPaymentStatus[keyof typeof GcashPaymentStatus];

type CondoPayment = {
    id: string,

    type: CondoPaymentType, // enum
    
    rentCost: number,
    expensesCost: number,
    maintenanceCost: number,

    additionalCost: number;
    totalPaid: number,

    linkId: string | null,
    isPaid: boolean,
    
    condoId: string,
    
    tenantId: string,

    receiptImage: string | null,
    isVerified: boolean | null,
    gcashStatus: GcashPaymentStatus | null,

    billingMonth: string,
    payedAt: string
}

type CondoPayments_Tenant = {
    tenant: {
        id: string
        name: string,
        email: string
    },
    condo: {
        id: string,
        name: string,
        address: string
    }
} & CondoPayment

type CondoPaymentsDashboard = {
    getCondoPayments: CondoPayments_Tenant[],
    hasNext: boolean,
    totalPages: number
}

type CondoPaymentsSummaryDashboard = {
    all: number,
    currentMonth: {
        total: number,
        month: string,
    },
    previousMonth: {
        total: number,
        month: string,
    },
    pendingVerification: number
}

type billingMonth = {
    rentCost: number;
    additionalCost: number;
    totalCost: number;
    billingMonth: string;
}

type CondoPaymentsTenant = {
    financialStatistics: {
        billingMonth: string;
        revenue: number;
        expenses: number;
    }[];
    totalRevenue: number;
    totalExpenses: number;
}