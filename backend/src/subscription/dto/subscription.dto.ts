import { IsEnum, IsString } from "class-validator";

export class SubscriptionTypeBody {

    @IsString()
    @IsEnum({
        Starter:"Starter",
        Pro:"Pro",
        Enterprise:"Enterprise"
    })
    type: 'Starter' | 'Pro' | 'Enterprise'
}