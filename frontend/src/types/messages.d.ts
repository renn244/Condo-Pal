
type message = {
    id: string;
    leaseAgreementId: string;
    senderId: string;
    receiverId: string;
    message: string;
    attachment: string[];

    isRead: boolean;

    createdAt: string;
    updatedAt: string;
}

type conversation = {
    id: string;
    sender: {
        id: user['id'];
        name: user['name'];
        profile: user['profile'];
    };
    condo: {
        name: condo['name'];
        address: condo['address'];
    };
    messages: message[];
    online: boolean;
    unreadCount: number;
} 

type conversationList = conversation[];

type selectedChat = {
    id: string,
    name: string,
    profile: string,
    condoName: condo['name'],
    condoAddress: condo['address'],
    online: boolean,
}