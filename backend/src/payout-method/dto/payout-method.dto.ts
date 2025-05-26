import { IsString } from "class-validator";


export class CreatePayoutMethod {
    @IsString()
    methodType: string;

    @IsString()
    mobileNumber: string;

    @IsString()
    accountName: string;
}

export class UpdatePayoutMethod extends CreatePayoutMethod {}