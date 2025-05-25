import { Injectable, NotFoundException } from '@nestjs/common';
import { UserJwt } from 'src/lib/decorators/User.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PayoutService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async getBalanceSummary(user: UserJwt) {
        const userPayout= await this.prisma.userPayout.findFirst({
            where: { userId: user.id }, 
            select: { totalAmount: true, availableAmount: true, id: true },
        })
            
        if(!userPayout) throw new NotFoundException({ message: 'User payout not found' })

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
}
