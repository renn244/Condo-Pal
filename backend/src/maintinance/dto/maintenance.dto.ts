import { MaintenanceType, PriorityLevel } from "@prisma/client";
import { IsDateString, IsEnum, IsString } from "class-validator";

export class TenantMaintenaceRequestDto {
    // @IsString()
    // condoId: string;

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    @IsEnum(MaintenanceType)
    type: MaintenanceType

    @IsString()
    @IsEnum(PriorityLevel)
    priorityLevel: PriorityLevel;

    @IsDateString()
    preferredSchedule: string;
}