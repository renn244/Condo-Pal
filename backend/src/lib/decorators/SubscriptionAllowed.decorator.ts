import { Reflector } from "@nestjs/core";
import { SubscriptionType } from "@prisma/client";

export const SubscriptionAllowed = Reflector.createDecorator<SubscriptionType[]>();
