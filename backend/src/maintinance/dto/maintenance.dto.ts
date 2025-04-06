import { MaintenanceType, PaymentResponsibility, PriorityLevel } from "@prisma/client";
import { IsArray, IsBoolean, IsDateString, IsEnum, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

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

export class ScheduleMaintenanceRequestDto {
    @IsNumber()
    estimatedCost: number;

    @IsString()
    @IsDateString()
    scheduledDate: string;

    @IsEnum(PaymentResponsibility, {
        message: "Payment responsibility must be either tenant or landlord"
    })
    paymentResponsibility: PaymentResponsibility;

    @IsBoolean()
    manualLink: boolean;

    // only for automated email / manualLink = false
    @IsOptional()
    @IsString()
    workerEmail?: string;

    @IsOptional()
    @IsString()
    additionalNotes?: string;

    @IsString()
    generatedToken: string;
}

export class InProgressMaintenanceRequestDto {
    @IsString()
    token: string;
}

export class CompleteMaintenanceRequestDto {
    @IsNumberString()
    totalCost: string;

    @IsString()
    message: string;

    @IsString()
    token: string;
}