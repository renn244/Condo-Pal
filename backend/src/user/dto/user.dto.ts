import { IsEmail, IsString, MinLength } from "class-validator";


export class ProfileDto {
    @IsString()
    name: string;
    
    @IsString()
    @IsEmail()
    email: string;
}

export class PasswordDto {
    @IsString()
    @MinLength(8, {
        message: "Password must be at least 8 characters"
    })
    password: string;

    @IsString()
    @MinLength(8, {
        message: "Password must be at least 8 characters"
    })
    newPassword: string;

    @IsString()
    @MinLength(8, {
        message: "Password must be at least 8 characters"
    })
    confirmPassword: string;
}