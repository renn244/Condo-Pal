import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard, PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID')!,
            clientSecret: configService.get('GOOGLE_CLIENT_SECRET')!,
            callbackURL: configService.get('GOOGLE_REDIRECT_URL')!,
            scope: ['email', 'profile'],
        })
    }

    async validate(
        access_token: string,
        refresh_token: string,
        profile: Profile,
        done: VerifyCallback
    ) {
        done(null, profile)
    }
}

export class GoogleAuthGuard extends AuthGuard('google') {}