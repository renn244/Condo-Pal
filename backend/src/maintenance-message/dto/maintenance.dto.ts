import { IsOptional, IsString } from "class-validator";

export class CreateMaintenanceMessageDto {
    @IsString()
    message: string;

    @IsString()
    @IsOptional()
    workerName?: string;
} 

export class CreateMaintenanceMessageWithFileDto extends CreateMaintenanceMessageDto {}