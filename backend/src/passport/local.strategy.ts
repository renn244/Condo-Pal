import { Strategy } from "passport-local";
import { AuthGuard, PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService
    ) {
        super({
            usernameField: 'email',
            passwordField: 'password'
        }); 
    }

    async validate(email: string, password: string) {
        const user = await this.authService.validateLocalLogin({ email, password});

        if(!user) {
            throw new UnauthorizedException("Could not login! try again");
        }

        return user;
    }
}

export class LocalAuthGuard extends AuthGuard('local') {}