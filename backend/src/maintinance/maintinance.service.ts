import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { UserJwt } from 'src/lib/decorators/User.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { TenantMaintenaceRequestDto } from './dto/maintenance.dto';

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
