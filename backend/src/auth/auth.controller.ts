import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterLandLordDto } from './dto/auth.dto';
import { LocalAuthGuard } from 'src/passport/local.strategy';
import { JwtAuthGuard } from 'src/passport/jwt.strategy';

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

    @UseGuards(LocalAuthGuard)
    @Post('login/local')
    async localLogin(@Request() req) {
        return this.authService.login(req.user);
    }

    @Post('register-landlord')
    async registerLandlord(@Body() body: RegisterLandLordDto) {
        return this.authService.registerLandlord(body)
    }
}
