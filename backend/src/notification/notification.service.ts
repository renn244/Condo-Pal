import { Injectable } from '@nestjs/common';
import { GeneralGateway } from 'src/general-gateway/general.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/notification.dto';
import { UserJwt } from 'src/lib/decorators/User.decorator';

@Injectable()
export class NotificationService {
    constructor(
        private readonly generalGateway: GeneralGateway,
        private readonly prisma: PrismaService
    ) {}

    async sendNotificationToUser(userId: string, body: CreateNotificationDto) {
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

    // do pagination later
    async getNotifications(user: UserJwt, query: { cursor?: string }) {
        const [notifications, unreadCount] = await Promise.all([
            this.prisma.notification.findMany({
                where: { userId: user.id }, orderBy: { createdAt: 'desc' },
                cursor: query.cursor ? { id: query.cursor } : undefined,
                take: 2, skip: query.cursor ? 1 : 0,
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
}
