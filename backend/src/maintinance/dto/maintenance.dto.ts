import { MaintenanceStatus, MaintenanceType, PaymentResponsibility, PriorityLevel } from "@prisma/client";
import { IsArray, IsBoolean, IsDateString, IsEnum, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class MaintenaceRequestDto {
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

export class TenantEditMaintenanceRequest extends MaintenaceRequestDto {

    @IsArray()
    @IsOptional()
    previousPhotos?: string[];
}

export class LandlordEditMaintenanceRequest extends MaintenaceRequestDto {
    @IsString()
    @IsEnum(MaintenanceStatus)
    Status: MaintenanceStatus;

    @IsNumberString()
    @IsOptional()
    estimatedCost?: string;

    @IsNumberString()
    @IsOptional()
    totalCost?: string;

    @IsString()
    @IsOptional()
    @IsEnum(PaymentResponsibility)
    paymentResponsibility?: PaymentResponsibility;

    @IsDateString()
    @IsOptional()
    scheduledDate: string;

    @IsDateString()
    @IsOptional()
    completionDate: string;

    @IsArray()
    @IsOptional()
    previousPhotos?: string[];

    @IsArray()
    @IsOptional()
    previousCompletionPhotos?: string[];
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