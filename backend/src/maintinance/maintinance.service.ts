import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { MaintenanceStatus, PriorityLevel, Prisma } from '@prisma/client';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { UserJwt } from 'src/lib/decorators/User.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { TenantEditMaintenanceRequest, TenantMaintenaceRequestDto } from './dto/maintenance.dto';

@Injectable()
export class MaintenanceService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fileUploadService: FileUploadService
    ) {}

    async TenantMaintenanceRequest(tenantUser: UserJwt, body: TenantMaintenaceRequestDto, photos: Array<Express.Multer.File>) {
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

        const createMaintinanceRequest = await this.prisma.maintenance.create({
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

        return createMaintinanceRequest;
    }

    async getMaintenanceRequestsLandlord(user: UserJwt, query: { search: string, page: string, status: string, priority: string }) {
        const take = 6;
        const skip = (parseInt(query.page || '1') - 1) * take;

        const where: Prisma.MaintenanceWhereInput = {
            condo: {
                ownerId: user.id
            },
            ...(query.search && {
                title: {
                    contains: query.search,
                    mode: 'insensitive'
                }
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
                take: take,
                skip: skip
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

    async getMaintenanceRequest(maintinanceId: string, user: UserJwt) {
        const maintenanceRequest = await this.prisma.maintenance.findFirst({
            where: {
                id: maintinanceId
            },
            include: {
                condo: {
                    select: {
                        id: true,
                        address: true,
                        tenantId: true,
                        ownerId: true,
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

    async editMaintenanceRequest(maintenanceId: string, tenantUser: UserJwt, body: TenantEditMaintenanceRequest, photos: Array<Express.Multer.File>) {
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
                id: maintenanceId
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

    // landlord // maybe add message why later?
    async cancelMaintenanceRequest(maintenanceId: string, user: UserJwt) {
        // make sure he owns the condo
        const condoOfMaintenance = await this.prisma.maintenance.findFirst({
            where: {
                id: maintenanceId
            },
            include: {
                condo: {
                    select: { tenantId: true, ownerId: true }
                }
            }
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

        return cancelMaintenance
    }    
}
