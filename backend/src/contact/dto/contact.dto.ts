import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ContactDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(20)
    @MaxLength(2000)
    message: string;
}
