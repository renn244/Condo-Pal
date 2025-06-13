import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateWorkerNameDto } from './dto/maintenance-worker-token.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MaintenanceWorkerToken } from '@prisma/client';

@Injectable()
export class MaintenanceWorkerTokenService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
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
        // Check cache first
        const getCacheToken = await this.cacheManager.get(`${query.maintenanceId}-${query.token}`);
        
        if(getCacheToken) return getCacheToken as MaintenanceWorkerToken

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

        this.cacheManager.set(`${query.maintenanceId}-${query.token}`, maintenanceWorkerToken, 1000 * 60 * 10)

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

        // Invalidate cache after update
        this.cacheManager.del(`${query.maintenanceId}-${query.token}`) // remove old cache
        
        return updatedMaintenanceWorkerToken;
    }
}
