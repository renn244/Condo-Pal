import { Body, Controller, Get, Param, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { MaintenanceService } from './maintinance.service';
import { User, UserJwt } from 'src/lib/decorators/User.decorator';
import { TenantEditMaintenanceRequest, TenantMaintenaceRequestDto } from './dto/maintenance.dto';
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

    @Get()
    async getMaintenanceRequestsLandlord(@User() user: UserJwt, @Query() query: { 
        search: string, page: string, status: string, priority: string, condoId?: string, take?: string
    }) {
        return this.maintenanceService.getMaintenanceRequestsLandlord(user, query);
    }

    @Get('stats/:condoId')
    async getMaintenanceStats(@User() user: UserJwt, @Param('condoId') condoId: string) {
        return this.maintenanceService.getMaintenanceStats(user, condoId);
    }
    
    @Get('getRequest')
    async getMaintenanceRequest(@User() user: UserJwt, @Query('maintenanceId') maintenanceId: string) {
        return this.maintenanceService.getMaintenanceRequest(maintenanceId, user);
    }

    @Patch('editMaintenanceRequest')
    @UseInterceptors(FilesInterceptor('photos', 3, {
        storage: multer.memoryStorage()
    }))
    async editMaintenanceRequest(@Query('maintenanceId') maintenanceId: string, @User() user: UserJwt, @Body() body: TenantEditMaintenanceRequest,
    @UploadedFiles() photos: Array<Express.Multer.File>) {
        return this.maintenanceService.editMaintenanceRequest(maintenanceId, user, body, photos);
    }

    @Patch('cancel')
    async cancelMaintenance(@User() user: UserJwt, @Query('maintenanceId') maintenanceId: string) {
        return this.maintenanceService.cancelMaintenanceRequest(maintenanceId, user);
    }
}
