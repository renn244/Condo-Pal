import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Cache } from "cache-manager";
import { PrismaService } from "src/prisma/prisma.service";
import { SubscriptionAllowed } from "../decorators/SubscriptionAllowed.decorator";

@Injectable()
export class SubscriptionGuard implements CanActivate {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly prisma: PrismaService,
        private readonly reflector: Reflector
    ) {}    

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const subscriptionsAllowed = this.reflector.get(SubscriptionAllowed, context.getHandler()) || [];
        const req = context.switchToHttp().getRequest();
        const user = req.user;
        
        // because SubscriptionGuard need to get User info
        if(!user) {
            throw new Error('JwtAuthGuard needs to be used in order for SubscriptionGuard to work')
        }

        // get User
        let getUser = await this.cacheManager.get(user.id) as any;
        if(!getUser) {
            getUser = await this.prisma.user.findUnique({
                where: {
                    id: user.id
                },
                select: {
                    id: true,
                    email: true,
                    profile: true,
                    name: true,
                    role: true,
                    isOAuth: true,
                    provider: true,
                    providerId: true,
                    createdAt: true,
                    updatedAt: true,
                    subscriptions: { // latest subscription
                        where: {
                            isPaid: true,
                            expiresAt: {
                                gte: new Date()
                            }
                        },
                        select: {
                            id: true,
                            type: true,
                            createdAt: true,
                            expiresAt: true
                        },
                        take: 1,
                        orderBy: {
                            createdAt: 'desc'
                        }
                    }
                }
            })

            if(!getUser) throw new UnauthorizedException()

            this.cacheManager.set(getUser.id, getUser); // caching it
        }

        // checking if there is available subscription if there is not then we return ForbiddenException
        if(getUser.subscriptions && getUser.subscriptions?.length === 0) {
            throw new ForbiddenException({
                name: 'subscription',
                message: "No Subscription"
            })
        }

        // if there is not allowedTypes then it's just checking for any subscription
        if(!subscriptionsAllowed.length) {
            // we are sure that there is subscription because we check earlier
            return true
        }

        // check Subscription if it fits
        const isSubscriptionValid = subscriptionsAllowed.includes(getUser.subscriptions?.[0].type)
        if(!isSubscriptionValid) {
            throw new ForbiddenException({
                name: 'subscription',
                message: `this is only for ${subscriptionsAllowed}`
            })
        }

        return true;
    }
}