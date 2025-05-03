import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { MaintenanceStatus, PriorityLevel, Prisma } from '@prisma/client';
import { eachMonthOfInterval, format, startOfYear } from 'date-fns';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { UserJwt } from 'src/lib/decorators/User.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompleteMaintenanceRequestDto, InProgressMaintenanceRequestDto, MaintenaceRequestDto, ScheduleMaintenanceRequestDto, TenantEditMaintenanceRequest } from './dto/maintenance.dto';
import { MaintenanceMessageService } from 'src/maintenance-message/maintenance-message.service';
import { v4 as uuidv4 } from 'uuid';
import { MaintenanceWorkerTokenService } from 'src/maintenance-worker-token/maintenance-worker-token.service';
import { EmailSenderService } from 'src/email-sender/email-sender.service';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class MaintenanceService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fileUploadService: FileUploadService,
        private readonly maintenanceMessageService: MaintenanceMessageService,
        private readonly maintenanceWorkerTokenService: MaintenanceWorkerTokenService,
        private readonly emailSenderService: EmailSenderService,
        private readonly notificationService: NotificationService
    ) {}

    async TenantMaintenanceRequest(tenantUser: UserJwt, body: MaintenaceRequestDto, photos: Array<Express.Multer.File>) {
        const condo = await this.prisma.condo.findUnique({
            where: {
                tenantId: tenantUser.id
            }
        })

        if(!condo) {
            // internal server error because we was supposed to have a condo
            throw new InternalServerErrorException("can't find your condo!")
        }

        // upload photos maximum of 3
        const photoUrls = await Promise.all(
            photos.map(async (photo) => {
                const newPhoto = await this.fileUploadService.upload(photo);
                return newPhoto.secure_url;
            })
        );

        const createMaintenanceRequest = await this.prisma.maintenance.create({
            data: {
                condoId: condo.id,
                title: body.title,
                description: body.description,
                photos: photoUrls,
                type: body.type,
                priorityLevel: body.priorityLevel,
                preferredSchedule: body.preferredSchedule
            }
        })

        // get landlordId to notify him
        this.notificationService.sendNotificationToUser(condo.ownerId, {
            title: "New Maintenance Request", link: `/dashboard/maintenance`, type: 'MAINTENANCE',
            message: `new Maintenanece request has been created by ${tenantUser.name} from ${condo.name}`,
        })

        return createMaintenanceRequest;
    }

    async LandlordMaintenanceRequest(user: UserJwt, condoId: string, body: MaintenaceRequestDto, photos: Array<Express.Multer.File>) {
        const getCondo = await this.prisma.condo.findUnique({
            where: { id: condoId, ownerId: user.id }
        })

        if(!getCondo) {
            throw new ForbiddenException('you are not allowed to create maintenance request for this condo!')
        }
        
        const photoUrls = await Promise.all(
            photos.map(async (photo) => {
                const newPhoto = await this.fileUploadService.upload(photo);
                return newPhoto.secure_url;
            })
        )

        const createMaintenanceRequest = await this.prisma.maintenance.create({
            data: {
                condoId: condoId,
                title: body.title,
                description: body.description,
                photos: photoUrls,
                type: body.type,
                priorityLevel: body.priorityLevel,
                preferredSchedule: body.preferredSchedule
            }
        })

        // get tenantId to notify the tenant
        if(getCondo.tenantId) {
            this.notificationService.sendNotificationToUser(getCondo.tenantId, {
                title: "New Maintenance Request", link: `/dashboard/maintenance`, type: 'MAINTENANCE',
                message: `new Maintenanece request has been created by ${user.name} from ${getCondo.name}`,
            })
        }

        return createMaintenanceRequest;
    }

    async getMaintenanceRequestsLandlord(user: UserJwt, query: { 
        search: string, page: string, status: string, priority: string, condoId?: string, take?: string
    }) {
        const take = parseInt(query.take || '6') || 6;
        const skip = (parseInt(query.page || '1') - 1) * take;

        const where: Prisma.MaintenanceWhereInput = {
            condo: {
                // if condo is specified then only show that condo
                ...(query.condoId ? {
                    id: query.condoId,
                    OR: [
                        {ownerId: user.id},
                        {tenantId: user.id}
                    ]
                } : {
                    OR: [
                        {ownerId: user.id},
                        {tenantId: user.id}
                    ]
                })
            },
            ...(query.search && {
                OR: [
                    {title: { contains: query.search, mode: 'insensitive' }},
                    {id: { contains: query.search, mode: 'insensitive' }},
                ]
            }),
            ...(query.status && query.status !== 'ALL' && {
                Status: query.status as MaintenanceStatus
            }),
            ...(query.priority && query.priority !== 'ALL' && {
                priorityLevel: query.priority as PriorityLevel
            })
        }

        const [maintenanceRequests, totalCount] = await Promise.all([
            this.prisma.maintenance.findMany({
                where: where,
                include: {
                    condo: { select: { id: true, name: true, address: true, } }
                },
                take: take, skip: skip,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.maintenance.count({ where: where })
        ])

        const hasNext = totalCount > (skip + take);
        const totalPages = Math.ceil(totalCount / take); // total pages available

        return {
            maintenanceRequests,
            hasNext,
            totalPages
        }
    }

    async getPriorityMainteanceRequests(user: UserJwt) {
        const condo = await this.prisma.condo.findMany({
            where: { ownerId: user.id },
            select: { id: true }
        })
        const condoIds = condo.flatMap((condo) => condo.id)

        const [maintenanceRequests, pendingMaintenanceCount] = await Promise.all([
            this.prisma.maintenance.findMany({
                where: { condoId: { in: condoIds }, Status: 'PENDING' }, orderBy: { priorityLevel: 'desc' },
                include: { condo: { select: { id: true, name: true, address: true } } },
                take: 5,
            }),
            this.prisma.maintenance.count({ where: { condoId: { in: condoIds }, Status: 'PENDING' } })
        ])

        return {
            maintenanceRequests,
            pendingMaintenanceCount
        };
    }

    async getMaintenanceCostDistributionStats(user: UserJwt, condoId: string, year?: number) {
        const currentYear = year || new Date().getFullYear();
        const startYear = startOfYear(new Date(currentYear, 0, 1));
        const endYear = new Date(currentYear, 11, 1); // January of December, representing the start of the month

        const maintenanceCost = await this.prisma.maintenance.findMany({
            where: { completionDate: { not: null, gte: startYear },  condoId: condoId },
            select: { completionDate: true, paymentResponsibility: true, totalCost: true }
        });

        const months = eachMonthOfInterval({ start: startYear, end: endYear }).map(date => format(date, 'yyyy-MM'));
        const data = months.reduce<Record<string, { month: string; landlord: number; tenant: number }>>((acc, month) => {
            acc[month] = { month, landlord: 0, tenant: 0 };
            return acc;
        }, {});

        maintenanceCost.forEach(({ completionDate, paymentResponsibility, totalCost }) => {
            if (!completionDate || !paymentResponsibility) return;
            const month = format(completionDate, 'yyyy-MM');
            const responsible = paymentResponsibility.toLowerCase(); // expects "landlord" or "tenant"

            if (data[month]) {
              data[month][responsible] += totalCost || 0;
            }
        });

        return Object.values(data);
    }

    async getMaintenanceStats(user: UserJwt, condoId: string) {
        const [
            pendingMaintenances, totalScheduled, totalInProgress, totalCompleted, totalCanceled,
            costDistributionStats
        ] = await Promise.all([
            this.prisma.maintenance.findMany({ where: { condoId, Status: MaintenanceStatus.PENDING }}),
            this.prisma.maintenance.count({ where: { condoId, Status: MaintenanceStatus.SCHEDULED } }),
            this.prisma.maintenance.count({ where: { condoId, Status: MaintenanceStatus.IN_PROGRESS } }),
            this.prisma.maintenance.count({ where: { condoId, Status: MaintenanceStatus.COMPLETED } }),
            this.prisma.maintenance.count({ where: { condoId, Status: MaintenanceStatus.CANCELED } }),
            this.getMaintenanceCostDistributionStats(user, condoId),
        ])

        return {
            costDistributionStats: costDistributionStats,
            statusStatistics: [
                { name: "Pending", value: pendingMaintenances.length },
                { name: "Scheduled", value: totalScheduled },
                { name: "In_Progress", value: totalInProgress },
                { name: "Completed", value: totalCompleted },
                { name: "Canceled", value: totalCanceled }
            ].filter((stat) => stat.value > 0),
            totalRequest: (totalScheduled + totalInProgress + totalCompleted + totalCanceled + pendingMaintenances.length),
            pendingMaintenances: pendingMaintenances
        }
    }

    async getMaintenanceRequest(maintenanceId: string, user: UserJwt) {
        const maintenanceRequest = await this.prisma.maintenance.findFirst({
            where: { id: maintenanceId },
            include: {
                condo: { 
                    select: { 
                        id: true, name: true, address: true, 
                        tenantId: true, tenant: { select: { name: true, profile: true } }, 
                        ownerId: true, owner: { select: { name: true, profile: true } }, 
                    }   
                }
            }
        })

        if(!maintenanceRequest) {
            throw new NotFoundException("maintinance not found")
        }

        // if the user is not a tenant or a landlord throw forbidden    
        const isOwnerOrTenant = maintenanceRequest.condo.ownerId === user.id || maintenanceRequest.condo.tenantId === user.id;
        if(!isOwnerOrTenant) {
            throw new ForbiddenException('you are not allowed to get this information')
        }
   
        return maintenanceRequest
    }

    async getMaintenanceRequestByToken(maintenanceId: string, token: string, user?: UserJwt) {
        const getWorker = await this.maintenanceWorkerTokenService.getMaintenanceWorkerToken({ maintenanceId, token }, false);

        if(!getWorker && !user) throw new ForbiddenException('you are not allowed to maintenance information!');

        const maintenanceRequest = await this.prisma.maintenance.findFirst({
            where: { id: maintenanceId },
            include: {
                condo: { 
                    select: { 
                        id: true, name: true, address: true, 
                        tenantId: true, tenant: { select: { name: true, profile: true } }, 
                        ownerId: true, owner: { select: { name: true, profile: true } }, 
                    }   
                }
            }
        })

        if(!maintenanceRequest) {
            throw new NotFoundException("maintinance not found")
        }
        
        return maintenanceRequest
    }

    async editMaintenanceRequest(maintenanceId: string, user: UserJwt, body: TenantEditMaintenanceRequest, photos: Array<Express.Multer.File>) {
        const getPhotosofMaintenance = await this.prisma.maintenance.findFirst({
            where: { id: maintenanceId },
            select: { photos: true }
        })
        const previousPhotos = body.previousPhotos || []
        
        // delete certain photos that will be replace
        if(getPhotosofMaintenance?.photos) {
            await Promise.all(getPhotosofMaintenance?.photos
            .filter((photo) => !previousPhotos.includes(photo))
            .map(async (photo) => 
                await this.fileUploadService.deleteFile(photo)
            ))
        }

        // upload photos maximum of 3
        const photoUrls = await Promise.all(
            photos.map(async (photo) => {
                const newPhoto = await this.fileUploadService.upload(photo);
                return newPhoto.secure_url;
            })
        );

        const editedMaintenance = await this.prisma.maintenance.update({
            where: {
                id: maintenanceId,
                OR: [
                    {condo: { tenantId: user.id }},
                    {condo: { ownerId: user.id }},
                ]
            },
            data: {
                photos: [...previousPhotos, ...photoUrls], // combine all the photos that is kept and newly uploaded
                title: body.title,
                description: body.description,
                type: body.type,
                priorityLevel: body.priorityLevel,
                preferredSchedule: body.preferredSchedule,
            }
        })

        return editedMaintenance
    }

    async scheduleMaintenanceRequest(maintenanceId: string, user: UserJwt, body: ScheduleMaintenanceRequestDto,) {
        const token = body.manualLink ? body.generatedToken : uuidv4();

        const condoOfMaintenance = await this.prisma.maintenance.findFirst({
            where: {
                id: maintenanceId,
            },
            include: {
                condo: {
                    select: { name: true, tenantId: true, ownerId: true }
                }
            }
        })

        if(!condoOfMaintenance) throw new NotFoundException('failed to maintenance!')

        const isOwnerOrTenant = condoOfMaintenance.condo.ownerId === user.id || condoOfMaintenance.condo.tenantId === user.id;
        if(!isOwnerOrTenant) throw new ForbiddenException('you are not allowed to update this!')

        const scheduleMaintenance = await this.prisma.maintenance.update({
            where: {
                id: maintenanceId,
            },
            data: {
                Status: 'SCHEDULED',
                scheduledDate: body.scheduledDate,
                estimatedCost: body.estimatedCost,
                paymentResponsibility: body.paymentResponsibility,
            },
            include: { 
                condo: {
                    select: {
                        name: true,
                        address: true,
                        tenant: { select: { name: true, profile: true } },
                        owner: { select: { name: true, profile: true } },
                    }
                }  
            }
        })

        this.maintenanceWorkerTokenService.createMaintenanceWorkerToken(maintenanceId, token);
        if(!body.manualLink) {
            this.emailSenderService.sendAssignedWorkerMaintenanceEmail(body.workerEmail!, scheduleMaintenance, token);
        }

        // get tenantId to notify
        if(condoOfMaintenance.condo.tenantId) {
            this.notificationService.sendNotificationToUser(condoOfMaintenance.condo.tenantId, {
                title: "New Maintenance Scheduled", link: `/dashboard/maintenance`, type: 'MAINTENANCE',
                message: `${scheduleMaintenance.title} Maintenanece has been scheduled by ${user.name} from ${condoOfMaintenance.condo.name}`,
            })
        }

        return scheduleMaintenance
    }

    async inProgressMaintenanceRequest(maintenanceId: string, body: InProgressMaintenanceRequestDto) {
        const getWorker = await this.maintenanceWorkerTokenService.getMaintenanceWorkerToken({ maintenanceId, token: body.token });

        if(!getWorker) throw new ForbiddenException('you are not allowed to update this!')

        const maintenanceRequest = await this.prisma.maintenance.update({
            where: { id: maintenanceId },
            data: { Status: 'IN_PROGRESS' },
            include: { condo: { select: { tenantId: true, ownerId: true, name: true }} }
        })

        this.maintenanceMessageService.createMaintenanceStatusUpdate(maintenanceId, {
            status: 'IN_PROGRESS',
            workerName: getWorker.workerName!,
        })

        // get both landlordId and tenantId to notify
        this.notificationService.sendNotificationToUser(maintenanceRequest.condo.tenantId || undefined, {
            title: "Maintenance In Progress", link: `/maintenance/worker/${maintenanceRequest.id}`, type: 'MAINTENANCE',
            message: `${maintenanceRequest.title} Maintenance has been started by ${getWorker.workerName} from ${maintenanceRequest.condo.name}`,
        })
        this.notificationService.sendNotificationToUser(maintenanceRequest.condo.ownerId, {
            title: "Maintenance In Progress", link: `/maintenance/worker/${maintenanceRequest.id}`, type: 'MAINTENANCE',
            message: `${maintenanceRequest.title} Maintenance has been started by ${getWorker.workerName} from ${maintenanceRequest.condo.name}`,
        })

        return maintenanceRequest
    }

    async completeMaintenanceRequest(maintenanceId: string, body: CompleteMaintenanceRequestDto, proof: Array<Express.Multer.File>) {
        const getWorker = await this.maintenanceWorkerTokenService.getMaintenanceWorkerToken({ maintenanceId, token: body.token });
        
        if(!getWorker) throw new ForbiddenException('you are not allowed to update this!')

        const photoUrls = await Promise.all(
            proof.map(async (photo) => {
                const newPhoto = await this.fileUploadService.upload(photo);
                return newPhoto.secure_url;
            })
        );
        
        const maintenanceRequest = await this.prisma.maintenance.update({
            where: { id: maintenanceId },
            data: { 
                Status: 'COMPLETED', 
                proofOfCompletion: photoUrls, 
                totalCost: parseInt(body.totalCost),
                completionDate: new Date(),
            }, include: { condo: { select: { tenantId: true, ownerId: true, name: true }} }
        })

        // notify the tenant and the landlord using email and build in notification in our app
        this.maintenanceMessageService.createMaintenanceStatusUpdate(maintenanceId, {
            status: 'COMPLETED',
            message: body.message,
            workerName: getWorker.workerName!,
        }, photoUrls)

        // notify here both the tenantId and landlordId
        if(maintenanceRequest.condo.tenantId) {
            this.notificationService.sendNotificationToUser(maintenanceRequest.condo.tenantId, {
                title: "Maintenance Completed", link: `/dashboard/maintenance`, type: 'MAINTENANCE',
                message: `${maintenanceRequest.title} Maintenance has been started by ${getWorker.workerName} from ${maintenanceRequest.condo.name}`,
            })
        }
        this.notificationService.sendNotificationToUser(maintenanceRequest.condo.ownerId, {
            title: "Maintenance Completed", link: `/dashboard/maintenance`, type: 'MAINTENANCE',
            message: `${maintenanceRequest.title} Maintenance has been started by ${getWorker.workerName} from ${maintenanceRequest.condo.name}`,
        })

        return maintenanceRequest
    }

    // landlord // maybe add message why later?
    async cancelMaintenanceRequest(maintenanceId: string, user: UserJwt) {
        // make sure he owns the condo
        const condoOfMaintenance = await this.prisma.maintenance.findFirst({
            where: { id: maintenanceId },
            include: { condo: { select: { tenantId: true, ownerId: true, name: true } } }
        })
        
        if(!condoOfMaintenance) throw new NotFoundException('failed to maintenance!')

        const isOwnerOrTenant = condoOfMaintenance.condo.ownerId === user.id || condoOfMaintenance.condo.tenantId === user.id;
        if(!isOwnerOrTenant) throw new ForbiddenException('you are not allowed to update this!')

        // TODO LATER: when he cancel's we should be able to put message of the landlord or tenant
        const cancelMaintenance = await this.prisma.maintenance.update({
            where: {
                id: maintenanceId,
            },
            data: {
                Status: 'CANCELED',
                canceledBy: user.role
            }
        })

        // notify for the opposite of who canceled
        if(condoOfMaintenance.condo.tenantId && condoOfMaintenance.condo.ownerId) {
            const userToNotify = condoOfMaintenance.condo.ownerId === user.id ? condoOfMaintenance.condo.tenantId : condoOfMaintenance.condo.ownerId;
            this.notificationService.sendNotificationToUser(userToNotify, {
                title: "Maintenance Canceled", link: `/dashboard/maintenance`, type: 'MAINTENANCE',
                message: `${cancelMaintenance.title} Maintenance has been canceled by ${user.name} from ${condoOfMaintenance.condo.name}`,
            })
        }

        return cancelMaintenance
    }
}
