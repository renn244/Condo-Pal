import { Injectable } from '@nestjs/common';
import { CloudinaryResponse } from 'src/file-upload/cloudinary/cloudinary-response';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { UserJwt } from 'src/lib/decorators/User.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCondoDto } from './dto/condo.dto';

@Injectable()
export class CondoService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fileUploadService: FileUploadService
    ) {}

    async createCondo(user: UserJwt, condoInfo: CreateCondoDto, condoPhoto: Express.Multer.File) {
        // save to cloudinary
        const photoUpload = await this.fileUploadService.upload(condoPhoto, { folder: 'Condopal/condoImages' })
        const photoUrl = photoUpload.secure_url;

        //change the types of data  // NOTE: no need to worry because it has been check if number in the CreateCondoDto
        const rentAmount = parseInt(condoInfo.rentAmount);
        const isActive = Boolean(condoInfo.isActive);

        const createCondoPrisma = await this.prisma.condo.create({
            data: {
                ownerId: user.id,
                photo: photoUrl,
                rentAmount: rentAmount,
                isActive: isActive,
                name: condoInfo.name,
                address: condoInfo.address
            },
            include: {
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        profile: true,
                    }
                }
            }
        })

        return createCondoPrisma;
    }

    // landlord
    async getMyCondos(user: UserJwt, page: number) {
        const take = 10;
        const skip = Math.max((page - 1) * take, 0);

        const getCondos = await this.prisma.condo.findMany({
            where: {
                ownerId: user.id
            },
            include: {
                tenant: {
                    select: {
                        id: true,
                        profile: true,
                        name: true,
                    }
                }
            },
            take: take,
            skip: skip
        })

        const getCondoCount = await this.prisma.condo.count({ where: { ownerId: user.id } });
        const hasNext = getCondoCount > (skip + getCondos.length);

        return { getCondos, hasNext }
    }

    async getCondo(condoId: string) {
        const Condo = await this.prisma.condo.findUnique({
            where: {
                id: condoId
            }
        })

        return Condo
    }

    async updateCondo(
        condoId: string, updateCondo: CreateCondoDto, condoPhoto: Express.Multer.File, user: UserJwt
    ) {
            let uploadPhoto: CloudinaryResponse | undefined = undefined;
            if(condoPhoto) {
                const getPreviousPhoto = await this.prisma.condo.findFirst({
                    where: { id: condoId },
                    select: { photo: true }
                })

                uploadPhoto = await this.fileUploadService.upload(condoPhoto, { folder: 'Condopal/condoImages' });
                if(getPreviousPhoto?.photo) await this.fileUploadService.deleteFile(getPreviousPhoto.photo); // delete previos photo if there is
            }

            const isActive = Boolean(updateCondo.isActive);
            const rentAmount = parseInt(updateCondo.rentAmount);

            const updatedCondo = await this.prisma.condo.update({
                where: {
                    id_ownerId: {
                        id: condoId,
                        ownerId: user.id
                    }
                },
                data: {
                    ...(uploadPhoto ? { photo: uploadPhoto.secure_url } : {}),
                    name: updateCondo.name,
                    address: updateCondo.address,
                    isActive: isActive,
                    rentAmount: rentAmount,
                },
                include: {
                    tenant: {
                        select: {
                            id: true,
                            name: true,
                            profile: true,
                        }
                    }
                }
            })

            return updatedCondo;
    }

    // should i delete it or archived it?
    async deleteCondo(condoId: string, user: UserJwt) {
        const deletedCondo = await this.prisma.condo.delete({
            where: {
                id_ownerId: {
                    id: condoId,
                    ownerId: user.id
                }
            }
        })

        if(deletedCondo.photo) this.fileUploadService.deleteFile(deletedCondo.photo);

        return deletedCondo
    }
}
