import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { MaintenanceWorkerTokenService } from './maintenance-worker-token.service';
import { UpdateWorkerNameDto } from './dto/maintenance-worker-token.dto';

@Controller('maintenance-worker-token')
export class MaintenanceWorkerTokenController {
    constructor(
        private readonly maintenanceWorkerTokenService: MaintenanceWorkerTokenService,
    ) {}

    @Get('getWorker')
    async getMantenanceWorker(@Query() query: { maintenanceId: string, token: string }) {
        return this.maintenanceWorkerTokenService.getMaintenanceWorkerToken(query);
    }

    @Patch('updateWorkerName')
    async updateMaintenanceWorkerName(@Query() query: { maintenanceId: string, token: string }, @Body() body: UpdateWorkerNameDto) {
        return this.maintenanceWorkerTokenService.updateMaintenanceWorkerName(query, body);
    }
}
