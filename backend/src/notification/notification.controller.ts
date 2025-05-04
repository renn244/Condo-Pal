import { Controller, Get, Param, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
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
}
