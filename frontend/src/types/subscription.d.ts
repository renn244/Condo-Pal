

const SubscriptionType = {
    Starter="Starter",
    Pro="Pro",
    Enterprise="Enterprise",
} as const
type SubscriptionType = typeof SubscriptionType[keyof typeof SubscriptionType]

type subscription = {
    id: string,
    type: SubscriptionType,
    userId: string,

    linkId: string, // this is the linkId of the link payment from paymongo

    createdAt: string,
    expiresAt: string,

    canceledAt?: string,
}

type subscriptionCheckUser = {
    id: subscription['id']
    type: subscription['type']
    createdAt: subscription['createdAt'],
    expiresAt: subscription['expiresAt']
}

type billingHistory = {
    id: subscription['id'];
    type: subscription['type'];
    linkId: string;

    createdAt: subscription['createdAt'];
    expiresAt: subscription['expiresAt'];
    canceledAt?: subscription['canceledAt'];
}[];

type getBillingHistory = {
    billingHistory: billingHistory;
    totalPages: number;
    hasNext: boolean;
}

type getCurrentPlan = {
    id: subscription['id'];
    type: subscription['type'];
    linkId: string;

    createdAt: subscription['createdAt'];
    expiresAt: subscription['expiresAt'];
    canceledAt?: subscription['canceledAt'];

    price: number;
    title: string;
    description: string;
    features: string[];
}

type getLatestSubscription = {
    price: number;
    title: string;
    description: string;
    features: string[];
} & subscription