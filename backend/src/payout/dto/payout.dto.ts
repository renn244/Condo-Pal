import { IsNumber, IsString } from "class-validator";

export class createPayoutDto {
    @IsNumber()
    amount: number;

    @IsString()
    payoutMethodId: string
}