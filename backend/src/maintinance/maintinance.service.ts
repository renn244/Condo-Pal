import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { UserJwt } from 'src/lib/decorators/User.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { TenantMaintenaceRequestDto } from './dto/maintenance.dto';
import { MaintenanceStatus, MaintenanceType, PriorityLevel } from '@prisma/client';

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
        const skip = (parseInt(query.page || '1') - 1) * 6;

        const getCondoIdFromUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            select: {
                condos: {
                    select: {
                        id: true
                    }
                }
            }
        })
        const getCondoIds = getCondoIdFromUser?.condos.map((condo) => condo.id)

        const maintenanceRequest = await this.prisma.maintenance.findMany({
            where: {
                condoId: { in: getCondoIds },
                // filtering of search, status and priority
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
            },
            include: {
                condo: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                    }
                }
            },
            take: take,
            skip: skip
        })
    
        // hasNext
        // count of pagination available

        return maintenanceRequest
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

}
