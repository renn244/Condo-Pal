import { Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryResponse } from 'src/file-upload/cloudinary/cloudinary-response';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { UserJwt } from 'src/lib/decorators/User.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCondoDto } from './dto/condo.dto';
import { CondoPaymentService } from 'src/condo-payment/condo-payment.service';

@Injectable()
export class CondoService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fileUploadService: FileUploadService,
        private readonly condoPaymentService: CondoPaymentService,
        private readonly condoPaymentModule: CondoPaymentService,
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

    async getMainDashboardSummary(user: UserJwt) {
        const condo = await this.prisma.condo.findMany({
            where: { ownerId: user.id }, select: { id: true }
        })
        const condoIds = condo.flatMap((condo) => condo.id)
        const currentBillingMonth = this.condoPaymentService.getBillingMonthOfDate(new Date());

        const [totalActive, totalCondo, totalPaidThisMonth, pendingMaintenance, pendingGcashPayment] = await Promise.all([
            this.prisma.condo.count({ where: { id: { in: condoIds } ,isActive: true } }),
            this.prisma.condo.count({ where: { id: { in: condoIds } } }),
            this.prisma.condoPayment.count({ where: { condoId: { in: condoIds }, billingMonth: currentBillingMonth, OR: [{ isVerified: true }, { isPaid: true }, { gcashStatus: 'APPROVED' }] } }),
            this.prisma.maintenance.count({ where: { condoId: { in: condoIds }, Status: 'PENDING' } }),
            this.prisma.condoPayment.count({ where: { condoId: { in: condoIds }, gcashStatus: 'PENDING' } }),
        ])

        return {
            totalActive,
            totalCondo,
            totalPaidThisMonth,
            pendingMaintenance,
            pendingGcashPayment,
        }
    }

    async getCondoOverview(user: UserJwt) {
        const [condoList, occupiedCount, vacantCount, totalCount] = await Promise.all([
            this.prisma.condo.findMany({ where: { ownerId: user.id, }, take: 3 }),
            this.prisma.condo.count({ where: { ownerId: user.id, isActive: true } }),
            this.prisma.condo.count({ where: { ownerId: user.id, isActive: false } }),
            this.prisma.condo.count({ where: { ownerId: user.id } }),
        ])

        return {
            condoList, occupiedCount, vacantCount, totalCount
        }
    }
    
    // landlord
    async getMyCondos(user: UserJwt, page: number) {
        const take = 6;
        const skip = Math.max((page - 1) * take, 0);

        const [getCondos, totalCount] = await Promise.all([
            this.prisma.condo.findMany({
                where: { ownerId: user.id }, take: take, skip: skip,
                include: {
                    tenant: { select: { id: true, profile: true, name: true } },
                    agreements: {
                        where: { isLeaseEnded: false }, select: { id: true },
                        orderBy: { createdAt: 'desc' }, take: 1,
                    }
                }
            }),
            this.prisma.condo.count({ where: { ownerId: user.id } })
        ])

        const totalPages = Math.ceil(totalCount / take);
        const hasNext = totalCount > (skip + getCondos.length);

        return { getCondos, hasNext, totalPages }
    }

    async getMyCondoList(user: UserJwt, page: number) {
        const take = 10;
        const skip = Math.max(((page || 1) - 1) * take, 0);
        
        const [getCondos, getCondoCount] = await Promise.all([
            this.prisma.condo.findMany({
                where: { ownerId: user.id },
                select: {
                    id: true,
                    name: true,
                    address: true,
                    rentAmount: true,
                    tenant: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }, take: take, skip: skip
            }),
            this.prisma.condo.count({ where: { ownerId: user.id } })
        ])

        const hasNext = getCondoCount > (skip + getCondos.length);

        return {
            getCondos,
            hasNext,
        }
    }

    async getCondo(condoId: string) {
        const Condo = await this.prisma.condo.findUnique({
            where: {
                id: condoId
            }
        })

        return Condo
    }


    async getCondoPaymentSummary(user: UserJwt, condoId: string) {
        const billingMonth = await this.condoPaymentService.getBillingMonth(condoId, user.id);

        const [totalMaintenanceCost, totalIncome] = await Promise.all([
            this.prisma.maintenance.aggregate({
                where: { condoId: condoId },
                _sum: { totalCost: true }
            }),
            this.prisma.condoPayment.aggregate({
                where: { 
                    condoId: condoId,
                    OR: [{ gcashStatus: 'APPROVED' }, { isPaid: true } ]
                },
                _sum: { totalPaid: true, additionalCost: true },
                _count: { id: true }
            }) 
        ])


        return {
            totalMaintenanceCost: totalMaintenanceCost._sum.totalCost || 0,
            totalExpenses: ((totalIncome._sum.additionalCost || 0) - (totalMaintenanceCost._sum.totalCost || 0)),
            totalIncome: totalIncome._sum.totalPaid || 0,
            totalPaymentCount: totalIncome._count.id || 0,
        }
    }

    async getViewCondo(condoId: string, user: UserJwt) {
        const [Condo, condoSummary, latestBilling] = await Promise.all([
            this.prisma.condo.findUnique({
                where: { id: condoId },
                include: {
                    owner: { select: { id: true, name: true, profile: true } },
                    tenant: { select: { id: true, name: true, profile: true } }
                }
            }),
            this.getCondoPaymentSummary(user, condoId),
            this.condoPaymentService.getTotalPayment(condoId, user),
        ])

        if(!Condo) throw new NotFoundException("condo not found!") 

        return {
            ...Condo,
            condoSummary: condoSummary,
            latestBill: latestBilling
        }
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

    async isCondoOwner(condoId: string, user: UserJwt) {
        const condo = await this.prisma.condo.findUnique({
            where: { id: condoId },
            select: { ownerId: true }
        })

        if(!condo) throw new NotFoundException("Condo not found!")

        return condo.ownerId === user.id;
    }
}
