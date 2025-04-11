import { Injectable } from '@nestjs/common';
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
            attachments.map(async (file) => {
                const newPhoto = await this.fileUploadService.upload(file, {
                    folder: 'message-attachments'
                })
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

        // notification for both leaseAgreement listenter (the active chat)
        // and the conversationList listener (the list of conversations)

        return message;
    }

    // active means the leaseAgreement has not yet ended
    async getActiveConversationListLandlord(user: UserJwt) {
        const conversations = await this.prisma.leaseAgreement.findMany({
            where: {
                AND: [
                    { condo: { ownerId: user.id } },
                    { isLeaseEnded: false },
                ]
            },
            select: {
                id: true,
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        profile: true,
                        condo: { select: { name: true, address: true } }
                    }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        })

        return conversations
    }

    // active means the leaseAgreement has not yet ended
    async getActiveConversationListTenant(user: UserJwt) {
        const conversations = await this.prisma.leaseAgreement.findMany({
            where: {
                AND: [
                    { tenantId: user.id },
                    { isLeaseEnded: false },
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
                                condo: { select: { name: true, address: true } }       
                            }
                        }
                    }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        })

        return conversations
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
