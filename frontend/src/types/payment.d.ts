type PaymentStatusResponse = {
    name: string,
    status: "pending" | "paid" | "failed" | "loading",
    linkId: string,
    checkouturl: string, // just in case the user want to go back to paying
}

type CondoPayment = {
    id: string,

    type: string, // enum
    
    rentCost: number,
    additionalCost: number | null;
    totalPaid: number,

    linkId: string | null,
    isPaid: boolean,
    
    condoId: string,
    
    tenantId: string,

    receiptImage: string | null,
    isVerified: boolean | null,
    gcashStatus: string | null,

    billingMonth: string,
    payedAt: string
}

type CondoPayments_Tenant = {
    tenant: {
        id: string
        name: string
    },
    condo: {
        id: string,
        name: string
    }
} & CondoPayment

type CondoPaymentsDashboard = {
    getCondoPayments: CondoPayments_Tenant[],
    hasNext: boolean,
    totalPages: number
}