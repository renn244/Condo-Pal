import { Body, Controller, Get, Param, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { MaintenanceService } from './maintinance.service';
import { User, UserJwt } from 'src/lib/decorators/User.decorator';
import { CompleteMaintenanceRequestDto, InProgressMaintenanceRequestDto, MaintenaceRequestDto, ScheduleMaintenanceRequestDto, TenantEditMaintenanceRequest } from './dto/maintenance.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { JwtAuthGuard } from 'src/passport/jwt.strategy';
import { Public } from 'src/lib/decorators/isPublic.decorator';
import { OptionalAuthGuard } from 'src/lib/guards/OptionalAuth.guard';
import { TenantGuard } from 'src/lib/guards/Tenant.guard';
import { LandLordGuard } from 'src/lib/guards/LandLord.guard';

@Controller('maintenance')
@UseGuards(JwtAuthGuard)
export class MaintenanceController {
    constructor(
        private readonly maintenanceService: MaintenanceService
    ) {}

    @UseGuards(TenantGuard)
    @Post('requestMaintenance')
    @UseInterceptors(FilesInterceptor('photos', 3, {
        storage: multer.memoryStorage()
    }))
    async requestMaintenance(@User() user: UserJwt, @Body() body: MaintenaceRequestDto, @UploadedFiles() files: Array<Express.Multer.File>) {
        return this.maintenanceService.TenantMaintenanceRequest(user, body, files);
    }

    @UseGuards(LandLordGuard)
    @Post('requestMaintenanceLandlord/:condoId')
    @UseInterceptors(FilesInterceptor('photos', 3, {
        storage: multer.memoryStorage()
    }))
    async requestMaintenanceLandlord(@User() user: UserJwt, @Param('condoId') condoId: string, @Body() body: MaintenaceRequestDto, @UploadedFiles() files: Array<Express.Multer.File>) {
        return this.maintenanceService.LandlordMaintenanceRequest(user, condoId, body, files);
    }

    @Get()
    async getMaintenanceRequestsLandlord(@User() user: UserJwt, @Query() query: { 
        search: string, page: string, status: string, priority: string, condoId?: string, take?: string
    }) {
        return this.maintenanceService.getMaintenanceRequestsLandlord(user, query);
    }

    @Get('getPriorityMaintenance')
    async getPriorityMaintenanceRequests(@User() user: UserJwt) {
        return this.maintenanceService.getPriorityMainteanceRequests(user);
    }

    @UseGuards(LandLordGuard)
    @Get('stats/:condoId')
    async getMaintenanceStats(@User() user: UserJwt, @Param('condoId') condoId: string) {
        return this.maintenanceService.getMaintenanceStats(user, condoId);
    }
    
    @Get('getRequest')
    async getMaintenanceRequest(@User() user: UserJwt, @Query('maintenanceId') maintenanceId: string) {
        return this.maintenanceService.getMaintenanceRequest(maintenanceId, user);
    }

    // public api that is dedicated for assigned worker with token authentication
    @Public()
    @UseGuards(OptionalAuthGuard)
    @Get('getRequestByToken')
    async getMaintenanceRequestByToken(@Query() query: { maintenanceId: string, token: string }, @User() user?: UserJwt) {
        return this.maintenanceService.getMaintenanceRequestByToken(query.maintenanceId, query.token, user);
    }

    @Patch('editMaintenanceRequest')
    @UseInterceptors(FilesInterceptor('photos', 3, {
        storage: multer.memoryStorage()
    }))
    async editMaintenanceRequest(@Query('maintenanceId') maintenanceId: string, @User() user: UserJwt, @Body() body: TenantEditMaintenanceRequest,
    @UploadedFiles() photos: Array<Express.Multer.File>) {
        return this.maintenanceService.editMaintenanceRequest(maintenanceId, user, body, photos);
    }

    @UseGuards(LandLordGuard)
    @Patch('schedule')
    async scheduleMaintenance(@User() user: UserJwt, @Query('maintenanceId') maintenanceId: string, 
    @Body() body: ScheduleMaintenanceRequestDto) {
        return this.maintenanceService.scheduleMaintenanceRequest(maintenanceId, user, body);
    }

    @Public()
    @Patch('in-progress')
    async inProgressMaintenance(@Query('maintenanceId') maintenanceId: string, @Body() body: InProgressMaintenanceRequestDto) {
        return this.maintenanceService.inProgressMaintenanceRequest(maintenanceId, body);
    }

    @Public()
    @UseInterceptors(FilesInterceptor('proof', undefined, {
        storage: multer.memoryStorage()
    }))
    @Patch('completed')
    async completedMaintenance(@Query('maintenanceId') maintenanceId: string, @Body() body: CompleteMaintenanceRequestDto,
    @UploadedFiles() proof: Array<Express.Multer.File>) {
        return this.maintenanceService.completeMaintenanceRequest(maintenanceId, body, proof);
    }

    @Patch('cancel')
    async cancelMaintenance(@User() user: UserJwt, @Query('maintenanceId') maintenanceId: string) {
        return this.maintenanceService.cancelMaintenanceRequest(maintenanceId, user);
    }
}
