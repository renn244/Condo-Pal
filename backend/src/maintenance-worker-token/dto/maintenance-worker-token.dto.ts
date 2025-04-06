import { IsString } from "class-validator";

export class UpdateWorkerNameDto {
    @IsString()
    workerName: string;
}