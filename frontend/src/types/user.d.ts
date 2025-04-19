
const userRole = {
    tenant="tenant",
    landlord="landlord"
} as const

const provider = {
    google="google",
    local="local",
} as const

type role = typeof userRole[keyof typeof userRole]
type provider = typeof provider[keyof typeof provider]

type checkUser = {
    id: string,
    email: string,
    profile?: string,
    name?: string,
    
    // this is only for tenant
    condo: { 
        id: string,
    }

    role: role,
    isOAuth: boolean,

    provider?: provider,
    providerId?: string

    subscriptions: subscriptionCheckUser[]

    createdAt: string,
    updatedAt: string,
}

type initialDataSettings = {
    id: string,
    name: string,
    profile: string,
    email: string,
    TwoFA: boolean,
}
