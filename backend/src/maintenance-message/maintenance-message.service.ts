import { ForbiddenException, Injectable } from '@nestjs/common';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMaintenanceMessageDto, CreateMaintenanceMessageWithFileDto, CreateMaintenanceStatusUpdateDto } from './dto/maintenance.dto';
import { UserJwt } from 'src/lib/decorators/User.decorator';
import { SenderType } from '@prisma/client';
import { MaintenanceMessageGateway } from './maintenance-message.gateway';
import { MaintenanceWorkerTokenService } from 'src/maintenance-worker-token/maintenance-worker-token.service';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class MaintenanceMessageService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fileUploadService: FileUploadService,
        private readonly maintenanceMessageGateway: MaintenanceMessageGateway,
        private readonly maintenanceWorkerTokenService: MaintenanceWorkerTokenService,
        private readonly notificationService: NotificationService
    ) {}

    async createMaintenanceMessageWithFile(maintenanceId: string, user: UserJwt, body: CreateMaintenanceMessageWithFileDto, 
    attachments: Array<Express.Multer.File>) {
        const senderType = user?.role.toUpperCase() as SenderType || 'WORKER';
        const photoUrls = await Promise.all(
            attachments.map(async (file) => {
                const newPhoto = await this.fileUploadService.upload(file, {
                    folder: 'maintenance-attachments'
                })
                return newPhoto.secure_url;
            })
        ) || [];

        const getWorkerName = senderType === 'WORKER' ?
            (await this.maintenanceWorkerTokenService.getMaintenanceWorkerToken({ maintenanceId, token: body.token || ''}))?.workerName
        : null

        // authorization for tenant and owner
        if(senderType !== 'WORKER') {
            const getMaintenanece = await this.prisma.maintenance.findUnique({
                where: { id: maintenanceId, },
                select: { 
                    id:true, title: true,
                    condo: { select: { ownerId: true, tenantId: true } },
                    messages: { select: { createdAt: true }, take: 1, orderBy: { createdAt: 'desc', }, }
                },
            })

            if(getMaintenanece?.condo.ownerId !== user?.id && getMaintenanece?.condo.tenantId !== user?.id) {
                throw new ForbiddenException('You are not authorized to send a message for this maintenance.')
            }

            // if the sender is a worker and it has been a day since the last message, send a notification to the condo owner and tenant
            if(getMaintenanece?.messages?.[0]?.createdAt! || new Date(getMaintenanece?.messages?.[0]?.createdAt) < new Date(Date.now() - 24 * 60 * 60 * 1000)) {
                this.notificationService.sendNotificationToUser(getMaintenanece?.condo.ownerId, {
                    title: `New message from ${getMaintenanece.title}`, type: 'MAINTENANCE',
                    message: `You have a new message from the maintenance worker. Click here to view it.`, link: `/maintenance/worker/${getMaintenanece.id}`
                })

                this.notificationService.sendNotificationToUser(getMaintenanece?.condo.tenantId || undefined, {
                    title: `New message from ${getMaintenanece.title}`, type: 'MAINTENANCE',
                    message: `You have a new message from the maintenance worker. Click here to view it.`, link: `/maintenance/worker/${getMaintenanece.id}`
                })
            }
        }

        const maintenanceMessage = await this.prisma.maintenanceMessage.create({
            data: {
                maintenanceId,
                message: body.message,
                workerName: getWorkerName,
                senderId: user?.id,
                senderType: senderType,
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

        // update the socket room for the maintenance
        this.maintenanceMessageGateway.io.to(maintenanceId).emit('newMessage', maintenanceMessage);
    
        return maintenanceMessage;
    }

    async createMaintenanceStatusUpdate(maintenanceId: string, body: CreateMaintenanceStatusUpdateDto, attachments: string[]=[]) {
        const maintenanceMessage = await this.prisma.maintenanceMessage.create({
            data: {
                isStatusUpdate: true,
                maintenanceId,
                message: body.message || "",
                senderType: 'WORKER',
                statusUpdate: body.status,
                attachment: attachments,
            }
        })
 
        // update the socket room for the maintenance
        this.maintenanceMessageGateway.io.to(maintenanceId).emit('newMessage', maintenanceMessage);

        return maintenanceMessage;
    }

    async getMaintenanceMessages(query: { maintenanceId: string, cursor?: string, token?: string }, user?: UserJwt) {
        const isAuthenticated = user 
            ? user.id 
            : await this.maintenanceWorkerTokenService.getMaintenanceWorkerToken({ maintenanceId: query.maintenanceId, token: query.token || '' }, false)
        
        if(!isAuthenticated) throw new ForbiddenException('You are not authorized to view this maintenance message.')

        const maintenanceMessages = await this.prisma.maintenanceMessage.findMany({
            where: { 
                AND: [
                    {maintenanceId: query.maintenanceId, },
                    !query.token ? {maintenance: { 
                        condo: {
                            OR: [
                                {ownerId: user?.id, },
                                {tenantId: user?.id, },
                            ]
                        }
                    }} : {}
                ]
            },
            include: {
                sender: { 
                    select: {
                        id: true,
                        name: true,
                        profile: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc', },
            take: 13,
            cursor: query.cursor ? { id: query.cursor } : undefined,
            skip: query.cursor ? 1 : 0,
        });

        const nextCursor = maintenanceMessages.length > 0 ? maintenanceMessages[maintenanceMessages.length - 1].id : null;

        return {
            messages: maintenanceMessages,
            nextCursor: nextCursor,
        };
    }
}