
type payoutMethod = {
    id: string;

    userId: string;

    methodType: string; // e.g, "GCASH", "MAYA", "GRABPAY"
    mobileNumber: string; // e.g, "09123456789" for GCASH or MAYA
    accountName: string; // e.g, "Juan Dela Cruz" for GCASH or MAYA

    createdAt: string;
    updatedAt: string;
}

type payout = {
    id: string;

    userPayoutId: string;
    payoutMethodId: string;
    amount: number;
    status: string; // e.g, "pending", "completed", "failed" // use if banks which we will not do because it's too big.

    createdAt: string;
    updatedAt: string;
}

type payoutWithMethod = payout & {
    payoutMethod: {
        id: string;
        accountName: string;
        methodType: string; // e.g, "GCASH", "MAYA", "GRABPAY"
    }
}

type payoutMethods = payoutMethod[];

type payoutforHistory = payoutWithMethod[];
