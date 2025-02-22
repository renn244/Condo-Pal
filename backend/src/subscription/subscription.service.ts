import { BadRequestException, Injectable } from '@nestjs/common';
import { SubscriptionType } from '@prisma/client';
import { UserJwt } from 'src/lib/decorators/User.decorator';
import { PaymongoService } from 'src/paymongo/paymongo.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { addMonths } from 'date-fns'

@Injectable()
export class SubscriptionService {
    constructor(
        private readonly paymongoService: PaymongoService,
        private readonly prisma: PrismaService
    ) {}

    handleTypeSubscription(type: 'Starter' | 'Pro' | 'Enterprise') {
        const prices = {
            'Starter': {
                price: 450,
                title: 'Starter',
                description: 'Perfect for side projects',
            },
            'Pro': {
                price: 1450,
                title: 'Pro',
                description: 'For growing businesses',
            },
            'Enterprise': {
                price: 5950,
                title: 'Enterprise',
                description: 'For large organizations'
            },
        }

        return prices[type]
    }

    // the types will be changed depending of the pricing titles
    async handleSubscriptionPayment(type: 'Starter' | 'Pro' | 'Enterprise') {
        const subscription = this.handleTypeSubscription(type);

        const createPaymentLink = await this.paymongoService.createPaymentLink(
            subscription.price, `${subscription.title}, ${subscription.description}`
        );

        return createPaymentLink
    }

    async verifyPayment(linkId: string, user: UserJwt) {
        const getPayment = await this.paymongoService.getPaymentLink(linkId);

        const status = getPayment.attributes.status as 'unpaid' | 'paid' | 'refunded' | 'partially_refunded' | 'disputed'

        if(status !== 'paid') {
            throw new BadRequestException({
                name: 'Payment status',
                message: 'Payment is not yet paid!'
            })
        }

        const subscriptionType = getPayment.attributes.description.split(',')[0] as SubscriptionType;
        const expiresAt = addMonths(new Date(), 1);

        // // save to the database
        const saveSubscription = await this.prisma.subscription.create({
            data: {
                type: subscriptionType,
                userId: user.id,
                linkId: getPayment.id,
                expiresAt: expiresAt,
            
            }
        })

        return {
            status: 'paid',
            message: 'successfully paid'
        }
    }
}
