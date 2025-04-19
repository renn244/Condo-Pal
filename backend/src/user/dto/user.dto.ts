import { IsBoolean, IsEmail, IsString, MinLength } from "class-validator";

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

export class TwoFADto {
    @IsBoolean()
    TwoFA: boolean;
}

export class NotificationDto {
    @IsBoolean()
    emailNotifications: boolean;
    
    @IsBoolean()
    pushNotifications: boolean;
    
    @IsBoolean()
    smsNotifications: boolean;
    
    @IsBoolean()
    maintenanceAlerts: boolean;
    
    @IsBoolean()
    paymentAlerts: boolean;
    
    @IsBoolean()
    leaseAlerts: boolean; // maybe replace with somethign better later
    
    @IsBoolean()
    marketingAlerts: boolean;
}