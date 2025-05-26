import { Injectable, NotFoundException } from '@nestjs/common';
import { UserJwt } from 'src/lib/decorators/User.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePayoutMethod, UpdatePayoutMethod } from './dto/payout-method.dto';

@Injectable()
export class PayoutMethodService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createPayoutMethod(user: UserJwt, body: CreatePayoutMethod) {
        const payoutMethod = await this.prisma.payoutMethod.create({
            data: { userId: user.id, ...body }
        })

        return payoutMethod;
    }

    async getPayoutMethods(user: UserJwt) {
        const payoutMethods = await this.prisma.payoutMethod.findMany({
            where: { userId: user.id }
        });

        return payoutMethods;
    }

    async getPayoutMethod(user: UserJwt, id: string)  {
        const payoutMethod = await this.prisma.payoutMethod.findUnique({
            where: { id, userId: user.id }
        })

        if(!payoutMethod) {
            throw new NotFoundException({ message: 'Payout Not Found' })
        }

        return payoutMethod;
    }

    async updatePayoutMethod(user: UserJwt, id: string, body: UpdatePayoutMethod) {
        const payoutMethod =  await this.prisma.payoutMethod.update({
            where: { id, userId: user.id },
            data: {
                ...body
            }
        })
  
        return payoutMethod;
    }

    async deletePayoutMethod(user: UserJwt, id: string) {
        const payoutMethod = await this.prisma.payoutMethod.delete({
            where: { id, userId: user.id }
        })
 
        return payoutMethod;
    }
}
