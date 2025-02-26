import { IsString, IsNumber, IsBoolean, IsNumberString, IsBooleanString, isNumberString } from "class-validator";

export class CreateCondoDto {
    @IsString()
    name: string;

    @IsString()
    address: string;

    // @IsNumberString()
    @IsNumberString()
    rentAmount: string; // this might be a number becauseo of multipart/form

    @IsBooleanString()
    isActive: string;
}