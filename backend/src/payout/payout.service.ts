import { Injectable, NotFoundException } from '@nestjs/common';
import { UserJwt } from 'src/lib/decorators/User.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPayoutDto } from './dto/payout.dto';

@Injectable()
export class PayoutService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createPayout(user: UserJwt, body: createPayoutDto) {
        const userPayout = await this.getUserPayout(user);

        if(userPayout.availableAmount < body.amount) {
            throw new NotFoundException('Insufficient available amount for payout');
        }

        const payout = await this.prisma.payouts.create({
            data: {
                userPayoutId: userPayout.id, amount: body.amount,
                payoutMethodId: body.payoutMethodId, status: 'completed'
            }
        })

        // reduce user payout available amount
        await this.prisma.userPayout.update({
            where: { id: userPayout.id },
            data: { availableAmount: { decrement: body.amount } }
        });

        return payout;
    }

    // add pagination and filter later
    async getPayoutHistory(user: UserJwt) {
        const userPayout = await this.getUserPayout(user);

        const payouts = await this.prisma.payouts.findMany({
            where: { userPayoutId: userPayout.id },
            include: { payoutMethod: { select: { id: true, accountName: true, methodType: true } } },
            orderBy: { createdAt: 'desc' },
            take: 10 // limit to 10 most recent payouts
        });

        return payouts;
    }

    async getBalanceSummary(user: UserJwt) {
        const userPayout= await this.getUserPayout(user);
            
        const withdrawn = await this.prisma.payouts.aggregate({
            where: { userPayoutId: userPayout.id, status: 'COMPLETED' },
            _sum: { amount: true }
        })

        return {
            total: userPayout.totalAmount,
            available: userPayout.availableAmount,
            withdrawn: withdrawn._sum.amount || 0,
        } 
    }

    async getUserPayout(user: UserJwt) {
        const userPayout = await this.prisma.userPayout.findFirst({ where: { userId: user.id } });

        if (!userPayout) {
            const createPayout = await this.prisma.userPayout.create({
                data: { userId: user.id, totalAmount: 0, availableAmount: 0 }
            })

            return createPayout;
        }

        return userPayout;
    }
}
