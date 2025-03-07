import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GcashPayment, GcashPaymentVerification, ManualPayment } from './dto/condo-payment.dto';
import { UserJwt } from 'src/lib/decorators/User.decorator';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { PaymongoService } from 'src/paymongo/paymongo.service';
import { CondoPaymentType } from '@prisma/client';

@Injectable()
export class CondoPaymentService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fileUploadService: FileUploadService,
        private readonly paymongoService: PaymongoService,
    ) {}

    private async getTotalPayment(condoId: string) {
        // TODO LATER wwe should be able to identify what month he is paying for he might be paying a little bit late
        // example march 1, but he was paying for february

        const getCondoPayment = await this.prisma.condo.findUnique({
            where: {
                id: condoId
            },
            select: {
                rentAmount: true // monthly rent
            }
        })

        const startOfMonth = new Date();
        startOfMonth.setDate(1); 
        startOfMonth.setHours(0, 0, 0, 0);
        
        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);

        // as of now we don't have penalties so just maintenance
        const getAdditionalCost = await this.prisma.maintenance.aggregate({
            _sum: {
                totalCost: true
            },
            where: {
                condoId: condoId,
                paymentResponsibility: 'TENANT',
                completionDate: {
                    gte: startOfMonth,
                    lte: endOfMonth
                }
            }
        })

        if(!getCondoPayment) {
            throw new NotFoundException('condo not found')
        }

        return {
            rentCost: getCondoPayment?.rentAmount,
            additionalCost: getAdditionalCost._sum.totalCost || 0,
            totalCost: getCondoPayment?.rentAmount + (getAdditionalCost._sum.totalCost || 0)
        }
    }

    async getPaymentInformation(user: UserJwt, condoId: string) {
        // we need to know what month he or she is paying
        const [condoInfo, getBill] = await Promise.all([
            await this.prisma.condo.findFirst({
                where: { AND: [
                    { id: condoId },
                    { tenantId: user.id }
                ] },
                select: { id: true, name: true, address: true, photo: true }
            }),
            await this.getTotalPayment(condoId)
        ])
        
        if(!condoInfo) {
            throw new NotFoundException('condo not found')
        }

        return {
            ...condoInfo,
            ...getBill,
        }
    }

    // GCASH PAYMENT
    async createGcashPayment(user: UserJwt, condoId: string, gcashPhoto: Express.Multer.File, body: GcashPayment) {
        const gcashUrl = (await this.fileUploadService.upload(gcashPhoto)).secure_url;
        
        const createPaymentGcash = await this.prisma.condoPayment.create({
            data: {
                type: CondoPaymentType.GCASH,
                rentCost: parseInt(body.rentCost),
                additionalCost: parseInt(body.additionalCost),
                totalPaid: parseInt(body.totalPaid),
                condoId: condoId,
                tenantId: user.id,

                receiptImage: gcashUrl,
                gcashStatus: 'PENDING',
                isVerified: false,

                // also input the month
            }
        })

        return createPaymentGcash // wait for it to be verified by the landlord
    }

    async getGcashPayment(condoPaymentId: string) {
        const gcashPayment =  await this.prisma.condoPayment.findFirst({
            where: {
                id: condoPaymentId
            },
            select: {
                id: true,
                type: true,
                rentCost: true,
                additionalCost: true,
                totalPaid: true,
                condo: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        photo: true
                    }
                },
                receiptImage: true,
                isVerified: true,
                gcashStatus: true,

                // get billingMonth,
                payedAt: true
            }
        })

        if(!gcashPayment) throw new NotFoundException('gcashPayment not found')

        return gcashPayment
    }

    async verifyGcashPayment(user: UserJwt, condoPaymentId: string, body: GcashPaymentVerification) {
        const isVerified = body.gcashStatus === 'APPROVED';
        const isPaid = isVerified; // same thing but this is used for paymongo
        
        const updatePayment = await this.prisma.condoPayment.update({
            where: {
                id: condoPaymentId
            },
            data: {
                isVerified,
                isPaid,
                gcashStatus: body.gcashStatus
            }
        })

        return updatePayment
    }

    // MANUAL PAYMENT // only landlord are allowed
    async createManualPayment(user: UserJwt, condoId: string, body: ManualPayment) {
        const getCondo = await this.prisma.condo.findUnique({ 
            where: { id: condoId },
            select: { tenantId: true } 
        })

        if(!getCondo) throw new NotFoundException('condo not found!')

        if(!getCondo.tenantId) throw new NotFoundException('there is no tenant!')

        const createManualPayment = await this.prisma.condoPayment.create({
            data: {
                type: CondoPaymentType.MANUAL,
                condoId: condoId,
                rentCost: body.rentCost,
                additionalCost: body.additionalCost,
                totalPaid: body.totalPaid,
                isPaid: true,
                tenantId: getCondo.tenantId
            }
        })

        return createManualPayment;
    }

    // PAYMONGO
    async createPaymongoPayment(tenant: UserJwt, condoId: string) {
        const getCondo = await this.prisma.condo.findUnique({
            where: {
                id: condoId,
                tenantId: tenant.id
            },
            select: { name: true, photo: true, address: true, tenant: { select : { name: true } } }
        })

        if(!getCondo) throw new NotFoundException('condo not found!');

        const totalPayment = await this.getTotalPayment(condoId);

        const createCondoPayment = await this.prisma.$transaction(async txprisma => {
            // get which billing month late
            
            const condoPayment = await txprisma.condoPayment.create({
                data: {
                    type: CondoPaymentType.PAYMONGO,
                    condoId: condoId,
                    tenantId: tenant.id,
                    rentCost: totalPayment.rentCost,
                    additionalCost: totalPayment.additionalCost,
                    totalPaid: totalPayment.totalCost,
                }
            })

            const title = `Monthly Rent and Additional Cost Payment for the condo "${getCondo.name}"`;

            const createPaymentLink = await this.paymongoService.createCondoPayment(
                totalPayment.rentCost, totalPayment.additionalCost, title, condoPayment.id
            )

            // updating the linkId
            await txprisma.condoPayment.update({
                where: {
                    id: condoPayment.id
                },
                data: {
                    linkId: createPaymentLink.id
                }
            })

            return createPaymentLink
        })

        return createCondoPayment;
    }

    async verifyPaymongoPayment(condoPaymentId: string, user: UserJwt) {
        const getSessionId = await this.prisma.condoPayment.findUnique({
            where: {
                id: condoPaymentId
            },
            select: {
                linkId: true // checkout_sessionId
            }
        })

        if(!getSessionId || !getSessionId.linkId) throw new NotFoundException({ name: 'CondoPayment', message: 'failed to find condo payment' })
            
        const getPayment = await this.paymongoService.getPaymentLink(getSessionId.linkId)
        const status = this.paymongoService.getStatusCheckoutSession(getPayment)

        if(status !== 'paid') {
            return {
                name: "Condo Payment",
                status: status || "pending",
                linkId: getSessionId.linkId,
                checkouturl: getPayment.attributes.checkout_url
            }
        }

        // update to isPaid to the database
        await this.prisma.condoPayment.update({
            where: {
                id: condoPaymentId,
                tenantId: user.id
            },
            data: {
                isPaid: true
            }
        })

        return {
            name: "Condo Payment",
            status: status,
            linkId: getSessionId,
            checkouturl: getPayment.attributes.checkout_url
        }
    }
}
