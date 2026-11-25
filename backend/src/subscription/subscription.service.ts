import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { addDays, addMonths } from 'date-fns';
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

    // one plan for everyone; old Pro and Enterprise records show the same plan
    getPlan(isTrial = false) {
        return {
            price: isTrial ? 0 : 450,
            title: isTrial ? 'Free trial' : 'CondoPal',
            description: 'Everything you need to manage your condos',
            features: [
                "Unlimited condos and tenants",
                "Rent payments by GCash or manual entry",
                "Maintenance requests and tracking",
                "Expense tracking",
                "Chat with tenants",
                "Dashboard and payment history",
            ],
        }
    }

    // only for landlords who never had a subscription
    async startTrial(user: UserJwt) {
        if(user.role !== 'landlord') {
            throw new ForbiddenException({ name: 'subscription', message: 'Only landlords can start a free trial' })
        }

        const hasSubscription = await this.prisma.subscription.findFirst({ where: { userId: user.id, isPaid: true } })
        if(hasSubscription) {
            throw new BadRequestException({ name: 'subscription', message: 'The free trial is only for accounts that never had a subscription' })
        }

        const trial = await this.prisma.subscription.create({
            data: {
                type: 'Starter',
                userId: user.id,
                isPaid: true,
                isTrial: true,
                expiresAt: addDays(new Date(), 14)
            }
        })

        this.cacheManager.del(user.id) // so the new subscription shows right away

        return trial
    }

    async handleSubscriptionPayment(type: 'Starter' | 'Pro' | 'Enterprise', user: UserJwt) {
        const subscription = this.getPlan();

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
                id: true, type: true, linkId: true, isTrial: true,
                createdAt: true, expiresAt: true, canceledAt: true,
            },
            orderBy: { createdAt: 'desc' }
        })

        if(!subscription) throw new NotFoundException({ name: 'subscription', message: 'failed to find subscription' })

        return {
            ...subscription,
            ...this.getPlan(subscription.isTrial),
        };
    }

    // expired or not
    async getLatestSubscription(user: UserJwt) {
        const subscription = await this.prisma.subscription.findFirst({
            where: { userId: user.id, isPaid: true },
            orderBy: { createdAt: 'desc' }
        })

        if(!subscription) {
            throw new NotFoundException({
                name: 'subscription',
                message: 'failed to find subscription'
            })
        }

        return {
            ...subscription,
            ...this.getPlan(subscription.isTrial),
        };
    }

    async getBillingHistory(user: UserJwt, query: { page?: string }) {
        const take = 10;
        const skip = (parseInt(query.page || '1') - 1) * take || 0;

        const [billingHistory, totalCount] = await Promise.all([
            this.prisma.subscription.findMany({
                where: { userId: user.id, isPaid: true, isTrial: false },
                select: {
                    id: true, type: true,  linkId: true,
                    createdAt: true, expiresAt: true, canceledAt: true, 
                },
                orderBy: { createdAt: 'desc' },
                take, skip
            }),
            this.prisma.subscription.count({
                where: { userId: user.id, isPaid: true, isTrial: false }
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
