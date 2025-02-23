

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
    user: any, // supposed to be user

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