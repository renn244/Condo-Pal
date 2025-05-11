import { Controller, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from 'src/passport/jwt.strategy';
import { User, UserJwt } from 'src/lib/decorators/User.decorator';

@Controller('notification')
@UseGuards(JwtAuthGuard)
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService,
    ) {}

    @Get()
    async getNotifications(@User() user: UserJwt, @Query() query: { cursor?: string }) {
        return this.notificationService.getNotifications(user, query);
    }

    @Get("filter")
    async getNotificationsWithFilter(@User() user: UserJwt, @Query() query: { cursor?: string, type?: string }, 
    @Query('isRead', new ParseBoolPipe({ optional: true })) isRead?: boolean) {
        return this.notificationService.getNotificationsWithFilter(user, { ...query, isRead })
    }

    @Get("recent")
    async getRecentNotifications(@User() user: UserJwt, @Query('take', new ParseIntPipe({ optional: true })) take?: number) {
        return this.notificationService.getRecentNotifications(user, take)
    }

    @Patch("markAllAsRead")
    async markAllAsRead(@User() user: UserJwt) {
        return this.notificationService.markAllAsRead(user);
    }

    @Patch(":notificationId")
    async notificationMarkAsRead(@User() user: UserJwt, @Param("notificationId") notificationId: string) {
        return this.notificationService.notificationMarkAsRead(user, notificationId);
    }

    @Delete(":notificationId")
    async deleteNotification(@User() user: UserJwt, @Param("notificationId") notificationId: string) {
        return this.notificationService.deleteNotification(user, notificationId);
    }
}
