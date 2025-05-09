import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
                features: [
                    "5 projects", 
                    "10GB storage", 
                    "Basic analytics", 
                    "Email support"
                ],
            },
            'Pro': {
                price: 1450,
                title: 'Pro',
                description: 'For growing businesses',
                features: [
                    "Unlimited projects",
                    "100GB storage",
                    "Advanced analytics",
                    "Priority support",
                    "Custom domains",
                    "Team collaboration",
                ],
            },
            'Enterprise': {
                price: 5950,
                title: 'Enterprise',
                description: 'For large organizations',
                features: [
                    "Unlimited everything",
                    "Advanced security",
                    "Custom integrations",
                    "24/7 phone support",
                    "SLA guarantee",
                    "Dedicated account manager",
                ],
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

            const createPaymentLink = await this.paymongoService.createPaymentSubscription(
                subscription.price, subscription.title, "Payment for CondoPal", createSubscriptionPrisma.id
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

        if(!getSessionId || !getSessionId.linkId  ) throw new NotFoundException({ name: 'subscription', message: 'failed to find subscription' })

        const getPayment = await this.paymongoService.getPaymentLink(getSessionId.linkId || '');
        const status = this.paymongoService.getStatusCheckoutSession(getPayment)
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

    async getCurrentPlan(user: UserJwt) {
        const subscription = await this.prisma.subscription.findFirst({
            where: {
                userId: user.id,
                isPaid: true
            },
            select: {
                id: true, type: true, linkId: true,
                createdAt: true, expiresAt: true, canceledAt: true, 
            },
            orderBy: { createdAt: 'desc' }
        })

        if(!subscription) throw new NotFoundException({ name: 'subscription', message: 'failed to find subscription' })

        return {
            ...subscription,
            ...this.handleTypeSubscription(subscription.type),
        };
    }

    async getBillingHistory(user: UserJwt, query: { page?: string }) {
        const take = 10;
        const skip = (parseInt(query.page || '1') - 1) * take || 0;

        const [billingHistory, totalCount] = await Promise.all([
            this.prisma.subscription.findMany({
                where: { userId: user.id },
                select: {
                    id: true, type: true,  linkId: true,
                    createdAt: true, expiresAt: true, canceledAt: true, 
                },
                orderBy: { createdAt: 'desc' },
                take, skip
            }),
            this.prisma.subscription.count({
                where: { userId: user.id }
            })
        ])

        const hasNext = totalCount > (skip + take);
        const totalPages = Math.ceil(totalCount / take);

        return {
            billingHistory,
            totalPages,
            hasNext,
        }
    }
}
