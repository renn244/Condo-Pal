import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { addMonths } from 'date-fns';
import { UserJwt } from 'src/lib/decorators/User.decorator';
import { PaymongoService } from 'src/paymongo/paymongo.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubscriptionService {
    constructor(
        private readonly paymongoService: PaymongoService,
        private readonly prisma: PrismaService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
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
    async handleSubscriptionPayment(type: 'Starter' | 'Pro' | 'Enterprise', user: UserJwt) {
        const subscription = this.handleTypeSubscription(type);

        const createSubscription = await this.prisma.$transaction(async (txprisma) => {
            const expiresAt = addMonths(new Date(), 1);

            const createSubscriptionPrisma = await txprisma.subscription.create({
                data: {
                    type: type,
                    userId: user.id,
                    expiresAt: expiresAt
                }
            })

            const createPaymentLink = await this.paymongoService.createPaymentLink(
                subscription.price, subscription.title, subscription.description, createSubscriptionPrisma.id
            );

            // updating the linkId
            await txprisma.subscription.update({
                where: {
                    id: createSubscriptionPrisma.id
                },
                data: {
                    linkId: createPaymentLink.id
                }
            })

            return createPaymentLink
        })

        return createSubscription;
    }

    async verifyPayment(subscriptionId: string, user: UserJwt) {
        const getSessionId = await this.prisma.subscription.findUnique({
            where: {
                id: subscriptionId
            },
            select: {
                linkId: true // checkout_sessionId
            }
        })

        if(!getSessionId) throw new NotFoundException({ name: 'subscription', message: 'failed to find subscription' })

        const getPayment = await this.paymongoService.getPaymentLink(getSessionId?.linkId || '');
        const lastPaymentIdx = getPayment.attributes.payments.length - 1;
        const status = getPayment.attributes.payments?.[lastPaymentIdx]?.attributes?.status as 'pending' | 'paid' | 'failed '

        if(status !== 'paid') {
            return {
                name: "Payment Status",
                status: status || "pending", // if there is nothing then it means it's still not being paid(pending)
                linkId: getSessionId.linkId,
                checkouturl: getPayment.attributes.checkout_url
            }
        }

        // update to isPaid to the database
        const updateIsPaidInSubscription = await this.prisma.subscription.update({
            where: {
                id: subscriptionId,
                userId: user.id
            },
            data: {
                isPaid: true      
            }
        })

        this.cacheManager.del(user.id) // clearing the cache so that the subscription will show

        return {
            name: "Payment Status",
            status: status,
            linkId: getSessionId.linkId,
            checkouturl: getPayment.attributes.checkout_url
        }
    }

}
