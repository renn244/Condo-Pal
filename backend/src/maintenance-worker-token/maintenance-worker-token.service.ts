import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateWorkerNameDto } from './dto/maintenance-worker-token.dto';

@Injectable()
export class MaintenanceWorkerTokenService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async createMaintenanceWorkerToken(maintenanceId: string, token: string) {
        const maintenanceWorkerToken = await this.prisma.maintenanceWorkerToken.create({
            data: {
                maintenanceId,
                token
            }
        })     

        return maintenanceWorkerToken;
    }

    async getMaintenanceWorkerToken(query: { maintenanceId: string, token: string }, isRequired: boolean = true) {
        const maintenanceWorkerToken = await this.prisma.maintenanceWorkerToken.findUnique({
            where: {
                token_maintenanceId: {
                    token: query.token,
                    maintenanceId: query.maintenanceId
                }
            }
        })

        if(!maintenanceWorkerToken && isRequired) {
            throw new NotFoundException("Maintenance worker token not found")
        }

        return maintenanceWorkerToken
    }

    async updateMaintenanceWorkerName(query: { maintenanceId: string, token: string }, body: UpdateWorkerNameDto) {
        const updatedMaintenanceWorkerToken = await this.prisma.maintenanceWorkerToken.update({
            where: {
                token_maintenanceId: {
                    token: query.token,
                    maintenanceId: query.maintenanceId
                }
            },
            data: {
                workerName: body.workerName
            }
        })

        return updatedMaintenanceWorkerToken;
    }
}
