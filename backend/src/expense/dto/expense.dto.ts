import { ExpenseCategory, Recurrence } from "@prisma/client";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Matches } from "class-validator";

export class CreateExpenseDto {
    @IsString()
    title: string;

    @IsString()
    notes?: string;

    @IsNumber()
    cost: number;

    @IsString()
    @IsEnum(ExpenseCategory, {
        message: "category must be one of the following: utility, association, cleaning, other",
    })
    category: ExpenseCategory;

    @IsBoolean()
    recurring: boolean;
    
    @IsString()
    @IsOptional()
    @IsEnum(Recurrence, {
        message: "recurrence must be one of the following: one_time, monthly, querterly, yearly",
    })
    recurrence?: Recurrence;

    @IsString()
    @IsOptional()
    @Matches(/^(0[1-9]|1[0-2])-\d{4}$/, {
        message: "billingMonth must be in MM-YYYY format with a valid month (01-12)",
    })
    billingMonth: string;

    @IsBoolean()
    @IsOptional()
    isPaid?: boolean;
}

export class UpdateExpenseDto extends CreateExpenseDto {}