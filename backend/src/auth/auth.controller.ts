import { Body, Controller, Get, Post, Request, Response, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from 'src/passport/google.strategy';
import { JwtAuthGuard } from 'src/passport/jwt.strategy';
import { LocalAuthGuard } from 'src/passport/local.strategy';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, LoginDto, RegisterLandLordDto, ResetPasswordForgotPasswordDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get('check')
    async check(@Request() req: any) {
        return this.authService.check(req.user)
    }

    @Post("refresh-token")
    async refreshToken(@Body() body: { refreshToken: string }) {
        return this.authService.validateRefreshToken(body.refreshToken);
    }

    @Get('google-login')
    @UseGuards(GoogleAuthGuard)
    async googleAuth(@Request() req: any) {}

    @Get('google-redirect')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@Request() req: any, @Response() res: any) {
        const tokens = await this.authService.validateGoogleLogin(req.user);
        return res.redirect(
            `${process.env.CLIENT_BASE_URL}/redirecttoken?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`
        )
    }

    // local login
    @UseGuards(LocalAuthGuard)
    @Post('login/local')
    async localLogin(@Request() req: any, @Body() body: LoginDto) {
        return this.authService.login(req.user, body.rememberMe);
    }

    @Post('register-landlord')
    async registerLandlord(@Body() body: RegisterLandLordDto) {
        return this.authService.registerLandlord(body)
    }
    
    @Post('forgot-password')
    async forgotPassword(@Body() body: ForgotPasswordDto) {
        return this.authService.forgotPassword(body)
    }

    @Post('forgot-password/resend')
    async resendForgotPassword(@Body() body: ForgotPasswordDto) {
        return this.authService.resendForgotPassword(body)
    }

    @Post('forgot-password/reset')
    async resetPasswordForgotPassword(@Body() body: ResetPasswordForgotPasswordDto) {
        return this.authService.resetPasswordForgotPassword(body)
    }
}
