import { Injectable } from '@nestjs/common';
import { GeneralGateway } from 'src/general-gateway/general.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/notification.dto';
import { UserJwt } from 'src/lib/decorators/User.decorator';
import { NotificationType, Prisma } from '@prisma/client';

@Injectable()
export class NotificationService {
    constructor(
        private readonly generalGateway: GeneralGateway,
        private readonly prisma: PrismaService
    ) {}

    async sendNotificationToUser(userId: string | undefined, body: CreateNotificationDto) {
        if(!userId) return;

        const notification = await this.prisma.notification.create({
            data: {
                type: body.type, title: body.title, 
                message: body.message, link: body.link, userId: userId
            }
        })

        // send the notification to the user
        const socketId = this.generalGateway.getSocketIdByUserId(userId);
        if(socketId) {
            this.generalGateway.io.to(socketId).emit('newNotification', notification);
        }

        return notification;
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
