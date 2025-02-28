
type condo = {
    id: string,
    name: string,
    address: string,
    photo: string,

    ownerId: string,
    // owner: any, // user

    tenantId: string,
    // tenant: any, // user

    rentAmount: number,
    isActive: boolean,

    createdAt: string,
    updatedAt: string,
}

type CondoCard = {
    id: condo['id'],
    name: condo['name'],
    address: condo['address'],
    photo: condo['photo'],

    ownerId: condo['ownerid'],

    tenantId: condo['tenantId'],
    tenant: {
        id: user['id'],
        name: user['name'],
        profile: user['profile']
    }

    rentAmount: condo['rentAmount'],
    isActive: condo['isActive'],

    createdAt: condo['createdAt'],
    updatedAt: condo['updatedAt']
}