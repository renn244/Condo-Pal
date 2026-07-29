import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/notification.dto';
import { UserJwt } from 'src/lib/decorators/User.decorator';
import { NotificationType, Prisma } from '@prisma/client';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    constructor(
        private readonly prisma: PrismaService,
        @InjectQueue('notification') private readonly notificationQueue: Queue
    ) {}

    sendNotificationToUser(userId: string | undefined, body: CreateNotificationDto): void {
        // Notifications must not delay API responses, but queue failures still
        // need an owner so they cannot become unhandled promise rejections.
        if (!userId) return;

        void this.notificationQueue.add('process', {
            userId: userId, type: body.type,
            title: body.title, message: body.message, link: body.link
        }).catch((error: Error) => {
            this.logger.error(`Failed to queue notification for user ${userId}`, error.stack);
        });
    }

    async getNotifications(user: UserJwt, query: { cursor?: string }) {
        const [notifications, unreadCount] = await Promise.all([
            this.prisma.notification.findMany({
                where: { userId: user.id }, orderBy: { createdAt: 'desc' },
                cursor: query.cursor ? { id: query.cursor } : undefined,
                take: 4, skip: query.cursor ? 1 : 0,
            }),
            this.prisma.notification.count({ where: { userId: user.id, isRead: false } })
        ])

        const nextCursor = notifications.length > 0 ? notifications[notifications.length - 1].id : null;
        
        return {
            notifications,
            unreadCount,
            nextCursor
        };
    }

    async getNotificationsWithFilter(user: UserJwt, query: { 
        cursor?: string, type?: string, isRead?: boolean
    }) {
        const where: Prisma.NotificationWhereInput = {
            userId: user.id,
            ...((query.type && query.type !== "ALL") && { type: query.type as NotificationType }),
            ...(query.isRead && { isRead: query.isRead })
        }

        const [notifications, unreadCount] = await Promise.all([
            this.prisma.notification.findMany({
                where: where, orderBy: { createdAt: 'desc' },
                cursor: query.cursor ? { id: query.cursor } : undefined,
                take: 10, skip: query.cursor ? 1 : 0,
            }),
            this.prisma.notification.count({ where: { userId: user.id, isRead: false } })
        ])

        const nextCursor = notifications.length > 0 ? notifications[notifications.length - 1].id : null;

        return {
            notifications,
            unreadCount,
            nextCursor
        }
    }

    async getRecentNotifications(user: UserJwt, take?: number) {
        take = take || 3; 

        const notifications = await this.prisma.notification.findMany({
            where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: take
        })

        return notifications;
    }

    async markAllAsRead(user: UserJwt) {
        const notifications = await this.prisma.notification.updateMany({
            where: { userId: user.id, isRead: false },
            data: { isRead: true }
        })

        return notifications;
    }

    async notificationMarkAsRead(user: UserJwt, notificationId: string) {
        const notification = await this.prisma.notification.update({
            where: {
                id: notificationId,
                userId: user.id
            },
            data: { isRead: true }
        })

        return notification
    }

    async deleteNotification(user: UserJwt, notificationId: string) {
        const notification = await this.prisma.notification.update({
            where: {
                id: notificationId,
                userId: user.id
            },
            data: { isDeleted: true }
        })

        return notification;
    }
}
