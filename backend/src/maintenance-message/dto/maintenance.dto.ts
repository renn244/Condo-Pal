import { MaintenanceMessageStatusUpdate } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class CreateMaintenanceMessageDto {
    @IsString()
    message: string;
} 

export class CreateMaintenanceMessageWithFileDto extends CreateMaintenanceMessageDto {
    @IsString()
    @IsOptional()
    token?: string;
}

export class CreateMaintenanceStatusUpdateDto {
    @IsString()
    @IsOptional()
    message?: string;

    @IsString()
    @IsOptional()
    workerName: string;

    @IsEnum(MaintenanceMessageStatusUpdate, {
        message: `status must be one of the following: ${Object.values(MaintenanceMessageStatusUpdate).join(', ')}`
    })
    status: MaintenanceMessageStatusUpdate;
}