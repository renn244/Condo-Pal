import { Body, Controller, Get, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { MaintenanceService } from './maintinance.service';
import { User, UserJwt } from 'src/lib/decorators/User.decorator';
import { TenantMaintenaceRequestDto } from './dto/maintenance.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { JwtAuthGuard } from 'src/passport/jwt.strategy';

@Controller('maintenance')
@UseGuards(JwtAuthGuard)
export class MaintenanceController {
    constructor(
        private readonly maintenanceService: MaintenanceService
    ) {}

    @Post('requestMaintenance')
    @UseInterceptors(FilesInterceptor('photos', 3, {
        storage: multer.memoryStorage()
    }))
    async requestMaintenance(@User() user: UserJwt, @Body() body: TenantMaintenaceRequestDto, @UploadedFiles() files: Array<Express.Multer.File>) {
        return this.maintenanceService.TenantMaintenanceRequest(user, body, files);
    }

    @Get('getRequest')
    async getMaintenanceRequest(@User() user: UserJwt, @Query('maintenanceId') maintenanceId: string) {
        return this.maintenanceService.getMaintenanceRequest(maintenanceId, user);
    }
}
