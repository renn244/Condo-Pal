import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { User, UserJwt } from 'src/lib/decorators/User.decorator';
import { OptionalAuthGuard } from 'src/lib/guards/OptionalAuth.guard';
import { CreateMaintenanceMessageDto } from './dto/maintenance.dto';
import { MaintenanceMessageService } from './maintenance-message.service';

@Controller('maintenance-message')
export class MaintenanceMessageController {
    constructor(
        private readonly maintenanceMessageService: MaintenanceMessageService,
    ) {}

    @UseGuards(OptionalAuthGuard)
    @Post('sendMessage')
    async createMaintenanceMessage(@Query('maintenanceId') maintenanceId: string, @User() user: UserJwt, 
    @Body() body: CreateMaintenanceMessageDto) {
        return this.maintenanceMessageService.createMaintenanceMessage(maintenanceId, user, body);
    }

    @UseGuards(OptionalAuthGuard)
    @Get('getMessages')
    async getMaintenanceMessages(@Query() query: { maintenanceId: string, cursor?: string }) {
        return this.maintenanceMessageService.getMaintenanceMessages(query);
    }
}
