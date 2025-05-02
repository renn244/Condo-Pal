import { NotificationType } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class CreateNotificationDto {
    @IsString()
    @IsEnum(NotificationType, {
        message: "Type must be one of the NotificationType",
    })
    type: NotificationType;

    @IsString()
    title: string;

    @IsString()
    message: string;

    @IsString()
    @IsOptional()
    link?: string;
}