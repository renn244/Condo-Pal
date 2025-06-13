import { ForbiddenException, Injectable } from '@nestjs/common';
import { SenderType } from '@prisma/client';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { UserJwt } from 'src/lib/decorators/User.decorator';
import { MaintenanceWorkerTokenService } from 'src/maintenance-worker-token/maintenance-worker-token.service';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMaintenanceMessageWithFileDto, CreateMaintenanceStatusUpdateDto } from './dto/maintenance.dto';
import { MaintenanceMessageGateway } from './maintenance-message.gateway';

@Injectable()
export class MaintenanceMessageService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fileUploadService: FileUploadService,
        private readonly maintenanceMessageGateway: MaintenanceMessageGateway,
        private readonly maintenanceWorkerTokenService: MaintenanceWorkerTokenService,
        private readonly notificationService: NotificationService
    ) {}

    private notifyBothLandlordAndTenant(title: string, maintenanceId: string, ownerId: string, tenantId?: string) {
        this.notificationService.sendNotificationToUser(ownerId, {
            title: `New message from ${title}`, type: 'MAINTENANCE',
            message: `You have a new message from the maintenance worker. Click here to view it.`, link: `/maintenance/worker/${maintenanceId}`
        })

        if(!tenantId) return;

        this.notificationService.sendNotificationToUser(tenantId || undefined, {
            title: `New message from ${title}`, type: 'MAINTENANCE',
            message: `You have a new message from the maintenance worker. Click here to view it.`, link: `/maintenance/worker/${maintenanceId}`
        })
    }

    async createMaintenanceMessageWithFile(maintenanceId: string, user: UserJwt, body: CreateMaintenanceMessageWithFileDto, 
    attachments: Array<Express.Multer.File>) {
        const senderType = (user?.role.toUpperCase() as SenderType) || 'WORKER';
        const photoUrls = attachments.length ? (await this.fileUploadService.uploadMany(attachments, { folder: 'maintenance-attachments' })).map(p => p.secure_url) : [];

        const getWorkerName = senderType === 'WORKER' ?
            (await this.maintenanceWorkerTokenService.getMaintenanceWorkerToken({ maintenanceId, token: body.token || ''}))?.workerName
        : null

        // authorization for tenant and owner
        if(senderType !== 'WORKER') {
            const getMaintenance = await this.prisma.maintenance.findUnique({
                where: { id: maintenanceId, },
                select: { 
                    id:true, title: true,
                    condo: { select: { ownerId: true, tenantId: true } },
                    messages: { select: { createdAt: true }, take: 1, orderBy: { createdAt: 'desc', }, }
                },
            })

            if(getMaintenance?.condo.ownerId !== user?.id && getMaintenance?.condo.tenantId !== user?.id) {
                throw new ForbiddenException('You are not authorized to send a message for this maintenance.')
            }

            // if the sender is a worker and it has been a day since the last message, send a notification to the condo owner and tenant
            if(getMaintenance?.messages?.[0]?.createdAt! && new Date(getMaintenance?.messages?.[0]?.createdAt) < new Date(Date.now() - 24 * 60 * 60 * 1000)) {
                this.notifyBothLandlordAndTenant(getMaintenance.title, maintenanceId, getMaintenance.condo.ownerId, getMaintenance.condo.tenantId || '');
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