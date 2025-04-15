import { Injectable, NotFoundException } from '@nestjs/common';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { GeneralGateway } from 'src/general-gateway/general.gateway';
import { LeaseAgreementModule } from 'src/lease-agreement/lease-agreement.module';
import { UserJwt } from 'src/lib/decorators/User.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fileUploadService: FileUploadService,
        private readonly generalGateway: GeneralGateway,
    ) {}

    async createMessageWithFile(query: { leaseAgreementId: string, receiverId: string }, user: UserJwt, body: any, 
    attachments: Array<Express.Multer.File>) {
        const senderId = user.id;

        const photoUrls = await Promise.all(
            attachments?.map(async (file) => {
                const newPhoto = await this.fileUploadService.upload(file, { folder: 'message-attachments' })
                return newPhoto.secure_url;
            })
        ) || [];

        const message = await this.prisma.message.create({
            data: {
                leaseAgreementId: query.leaseAgreementId,
                message: body.message,
                senderId: senderId,
                receiverId: query.receiverId,
                attachment: photoUrls
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        profile: true,
                    }
                }
            }
        })

        const receiverSocketId = this.generalGateway.getSocketIdByUserId(query.receiverId);
        const senderSocketId = this.generalGateway.getSocketIdByUserId(senderId);

        // notification for both leaseAgreement listenter (the active chat)
        this.generalGateway.io.to(receiverSocketId).emit('newMessageCondo', message);
        // and the conversationList listener (the list of conversations) // update both to not complicate things
        this.generalGateway.io.to([receiverSocketId, senderSocketId]).emit('newMessageConversation', message);

        return message;
    }

    // when the user just clicked the conversation and wants to see the messages
    async updateSeenMessages(query: { leaseAgreementId: string }, user: UserJwt)  {
        const receiverId = user.id;
        const isLandlord = user.role === 'landlord';

        const [_, getUser] = await Promise.all([
            this.prisma.message.updateMany({
                where: { leaseAgreementId: query.leaseAgreementId, receiverId: receiverId, isRead: false },
                data: { isRead: true },
            }),
            this.prisma.leaseAgreement.findUnique({
                where: { id: query.leaseAgreementId },
                select: { tenantId: true, condo: { select: { ownerId: true } } }
            })
        ])

        const senderId = isLandlord ? getUser?.tenantId : getUser?.condo.ownerId;
        const socketSenderId = this.generalGateway.getSocketIdByUserId(senderId!);
        if(senderId) this.generalGateway.io.to(socketSenderId).emit('seenAllMessagesCondo', { leaseAgreementId: query.leaseAgreementId }); 

        return {
            message: 'Message seen!',
            leaseAgreementId: query.leaseAgreementId,
        }
    }

    async getActiveConversationListLandlord(user: UserJwt, query: { search: string }) {
        const conversations = await this.prisma.leaseAgreement.findMany({
            where: {
                AND: [
                    { condo: { ownerId: user.id } },
                    { isLeaseEnded: false },
                    { tenant: { name: { contains: query.search, mode: 'insensitive' } } }
                ]
            },
            select: {
                id: true,
                condo: {
                    select: {
                        tenant: {
                            select: {
                                id: true,
                                name: true,
                                profile: true,
                            }
                        },
                        name: true,
                        address: true,
                    }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                },
                _count: {
                    select: { messages: { where: { isRead: false, receiverId: user.id, } } }
                }
            }
        })

        // formatting data
        const formattedConversatons = conversations.map((conversation) => {
            return {
                id: conversation.id,
                sender: conversation.condo.tenant,
                condo: {
                    name: conversation.condo.name,
                    address: conversation.condo.address
                },
                messages: conversation.messages,
                online: this.generalGateway.isUserOnline(conversation.condo.tenant?.id || ""),
                unreadCount: conversation._count.messages,
            }
        })

        return formattedConversatons
    }


    async getActiveConversationListTenant(user: UserJwt, query: { search: string }) {
        const conversations = await this.prisma.leaseAgreement.findMany({
            where: {
                AND: [
                    { tenantId: user.id },
                    { isLeaseEnded: false },
                    { condo: { owner: { name: { contains: query.search, mode: 'insensitive' } } } }
                ]
            },
            select: {
                id: true,
                condo: {
                    select: {
                        owner: {
                            select: {
                                id: true,
                                name: true,
                                profile: true,
                            }
                        },
                        name: true,
                        address: true,
                    }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                },
                _count: {
                    select: { messages: { where: { isRead: false, receiverId: user.id, } } }
                }
            },
        })

        // formatting data
        const formattedConversatons = conversations.map((conversation) => {
            return {
                id: conversation.id,
                sender: conversation.condo.owner,
                condo: {
                    name: conversation.condo.name,
                    address: conversation.condo.address,
                },
                messages: conversation.messages,
                online: this.generalGateway.isUserOnline(conversation.condo.owner.id),
                unreadCount: conversation._count.messages,
            }
        })

        return formattedConversatons
    }

    async getSelectedChatInfo(query: { leaseAgreementId: string }, user: UserJwt) {
        const isLandlord = user.role === 'landlord';

        const selectedChat = await this.prisma.leaseAgreement.findUnique({
            where: { id: query.leaseAgreementId },
            select: {
                tenant: { select: { id: true, name: true, profile: true, } },
                condo: {
                    select: {
                        owner: {
                            select: {
                                id: true,
                                name: true,
                                profile: true,
                            }
                        },
                        name: true,
                        address: true,
                    },
                },
                leaseStart: true,
            }
        })

        if(!selectedChat) {
            throw new NotFoundException("Conversation not found!")
        }

        const formattedData = {
            id: query.leaseAgreementId,
            name: isLandlord ? selectedChat?.tenant.name : selectedChat?.condo.owner.name,
            profile: isLandlord ? selectedChat?.tenant.profile : selectedChat?.condo.owner.profile,
            condoName: selectedChat?.condo.name,
            address: selectedChat?.condo.address,
            leaseStart: selectedChat?.leaseStart,
            online: this.generalGateway.isUserOnline(isLandlord ? selectedChat.tenant.id : selectedChat.condo.owner.id)
        }

        return formattedData;
    }
    
    async getMessages(query: { leaseAgreementId: string, cursor?: string }, user: UserJwt) {
        if(!query.cursor) {
            // if initial check message (no cursor) then update all messages to seen
            this.updateSeenMessages({ leaseAgreementId: query.leaseAgreementId }, user)
        }
        
        const messages = await this.prisma.message.findMany({
            where: { leaseAgreementId: query.leaseAgreementId },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        profile: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 13,
            cursor: query.cursor ? { id: query.cursor } : undefined,
            skip: query.cursor ? 1 : 0,
        })

        const nextCursor = messages.length > 0 ? messages[messages.length - 1].id : null;

        return {
            messages,
            nextCursor
        }
    }
}
