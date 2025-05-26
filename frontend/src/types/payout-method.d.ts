
type payoutMethod = {
    id: string;

    userId: string;

    methodType: string; // e.g, "GCASH", "MAYA", "GRABPAY"
    mobileNumber: string; // e.g, "09123456789" for GCASH or MAYA
    accountName: string; // e.g, "Juan Dela Cruz" for GCASH or MAYA

    createdAt: string;
    updatedAt: string;
}

type payoutMethods = payoutMethod[];