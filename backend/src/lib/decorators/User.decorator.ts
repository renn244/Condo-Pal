import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import  { User as UserType } from '@prisma/client';

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user
    }
)

export type UserJwt = {
    id: UserType['id'],
    email: UserType['email'],
    name: UserType['name'],
    role: UserType['role'],

    isOauth: UserType['isOAuth'],
    provider: UserType['provider'],

    createdAt: UserType['createdAt']
}