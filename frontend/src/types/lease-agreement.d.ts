
type leaseAgreement = {
    id: string,

    leaseStart: string,
    leaseEnd: string,
    due_date: number,

    condoId: string,
    tenantId: string,

    isLeaseEnded: boolean,

    createdAt: string,
    updatedAt: string,
}

type getLatestLeaseEndedAgreement = {
    condo: {
        id: condo['id'], name: condo['name'], address: condo['address'], photo: condo['photo'],
        owner: { id: string, name?: string, profile?: string }
    },
    tenant: { id: string, name?: string, profile?: string },
} & leaseAgreement

