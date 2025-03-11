import { IsInt } from "class-validator";


export class UpdateLeaseAgreementDto {

    @IsInt()
    due_date: number;

}