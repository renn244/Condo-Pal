import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateLeaseAgreementDto } from './dto/lease-agreement.dto';
import { UserJwt } from 'src/lib/decorators/User.decorator';
import { truncateByDomain } from 'recharts/types/util/ChartUtils';

@Injectable()
export class LeaseAgreementService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createLeaseAgreement(leaseStart: Date, due_date: number, condoId: string, tenantId: string) {
        const createLeaseAgreement = await this.prisma.leaseAgreement.create({
            data: {
                leaseStart: leaseStart,
                due_date: due_date,
                condoId: condoId,
                tenantId: tenantId,
            }
        })

        return createLeaseAgreement;
    }

    async getLatestLeaseEndedAgreement(user: UserJwt) {
        const recentAgreement = await this.prisma.leaseAgreement.findFirst({
            where: { tenantId: user.id }, orderBy: { createdAt: 'desc' }, take: 1,
            include: {
                condo: {
                    select: {
                        id: true, name: true, address: true, photo: true,
                        owner: { select: { id: true, name: true, profile: true } }
                    }
                },
                tenant: { select: { id: true, name: true, profile: true } },
            }
        })

        if(!recentAgreement) throw new NotFoundException('no lease agreement found');

        return recentAgreement;
    }

    async getLeaseAgreement(leaseAgreementId: string) {
        const getLeaseAgreement = await this.prisma.leaseAgreement.findUnique({
            where: {
                id: leaseAgreementId,
            },
            include: {
                condo: {
                    select: {
                        id: true, name: true, address: true, photo: true,
                        owner: { select: { id: true, name: true, profile: true } }
                    }
                },
                tenant: { select: { id: true, name: true, profile: true } },
            }
        })

        if(!getLeaseAgreement) throw new NotFoundException('lease agreement not found')

        return getLeaseAgreement
    }

    async updateLeaseAgreement(leaseAgreementId: string, body: UpdateLeaseAgreementDto) {

        const leaseAgreement = await this.prisma.leaseAgreement.update({
            where: {
                id: leaseAgreementId
            },
            data: {
                due_date: body.due_date,
            }
        })

        return leaseAgreement;
    }

    async endLeaseAgreement(user: UserJwt, leaseAgreementId: string) {
        const leaseEnded = new Date();

        const endLeaseAgreement = await this.prisma.leaseAgreement.update({
            where: {
                id: leaseAgreementId,
                condo: { ownerId: user.id }
            },
            data: {
                isLeaseEnded: true,
                leaseEnd: leaseEnded,
            },
            include: { condo: { select: { id: true, name: true,  } } }
        })

        return endLeaseAgreement;
    }
}
