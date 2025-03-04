import { MaintenanceType, PriorityLevel } from "@prisma/client";
import { IsArray, IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

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
    @IsOptional()
    preferredSchedule: string;
}

export class TenantEditMaintenanceRequest extends TenantMaintenaceRequestDto {

    @IsArray()
    @IsOptional()
    previousPhotos?: string[];
}