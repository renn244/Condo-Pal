import { Body, Controller, Get, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { User, UserJwt } from 'src/lib/decorators/User.decorator';
import { OptionalAuthGuard } from 'src/lib/guards/OptionalAuth.guard';
import { CreateMaintenanceMessageDto, CreateMaintenanceMessageWithFileDto } from './dto/maintenance.dto';
import { MaintenanceMessageService } from './maintenance-message.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

@Controller('maintenance-message')
export class MaintenanceMessageController {
    constructor(
        private readonly maintenanceMessageService: MaintenanceMessageService,
    ) {}

    @UseGuards(OptionalAuthGuard)
    @UseInterceptors(FilesInterceptor('attachments', undefined, {
        storage: multer.memoryStorage()
    }))
    @Post('sendMessage')
    async createMaintenanceMessage(@Query('maintenanceId') maintenanceId: string, @User() user: UserJwt, 
    @Body() body: CreateMaintenanceMessageWithFileDto, @UploadedFiles() attachments: Array<Express.Multer.File>) {
        return this.maintenanceMessageService.createMaintenanceMessageWithFile(maintenanceId, user, body, attachments);
    }

    @UseGuards(OptionalAuthGuard)
    @Get('getMessages')
    async getMaintenanceMessages(@Query() query: { maintenanceId: string, cursor?: string }) {
        return this.maintenanceMessageService.getMaintenanceMessages(query);
    }
}
