import { GcashPaymentStatus } from "@prisma/client";
import { IsEnum, IsNumber, IsNumberString, IsString } from "class-validator";

export class GcashPayment {
    @IsNumberString()
    rentCost: string;

    @IsNumberString()
    additionalCost: string;

    @IsNumberString()
    totalPaid: string;
}

export class GcashPaymentVerification {
    @IsString()
    @IsEnum(GcashPaymentStatus)
    gcashStatus: GcashPaymentStatus;
}

export class ManualPayment {
    @IsNumber()
    rentCost: number;

    @IsNumber()
    additionalCost: number;

    @IsNumber()
    totalPaid: number;

    // add billing month
}