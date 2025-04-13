import { Injectable, NotFoundException } from '@nestjs/common';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { GeneralGateway } from 'src/general-gateway/general.gateway';
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

    // active means the leaseAgreement has not yet ended
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
                online: false, // TODO: implement online status
                unreadCount: conversation._count.messages,
            }
        })

        return formattedConversatons
    }

    // active means the leaseAgreement has not yet ended
    async getActiveConversationListTenant(user: UserJwt, query: { search: string }) {
        const conversations = await this.prisma.leaseAgreement.findMany({
            where: {
                AND: [
                    { tenantId: user.id },
                    { isLeaseEnded: false },
                    { condo: { name: { contains: query.search, mode: 'insensitive' } } }
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
                online: false, // TODO: implement online status
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
            online: false, // TODO: implement online status
        }

        return formattedData;
    }
    
    async getMessages(query: { leaseAgreementId: string, cursor?: string }, user: UserJwt) {
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
