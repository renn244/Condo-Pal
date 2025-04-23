import { ExpenseCategory, Recurrence } from "@prisma/client";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateExpenseDto {
    @IsString()
    title: string;

    @IsString()
    notes: string;

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
        message: "recurrence must be one of the following: one_time, weekly, ",
    })
    recurrence?: Recurrence;
}

export class UpdateExpenseDto extends CreateExpenseDto {}