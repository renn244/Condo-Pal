import { Body, Controller, Get, InternalServerErrorException, Patch, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/passport/jwt.strategy';
import { User, UserJwt } from 'src/lib/decorators/User.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { BillingInfoDto, NotificationDto, PasswordDto, ProfileDto, TwoFADto } from './dto/user.dto';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Get('initial-data')
    async getUserInitialData(@User() user: UserJwt) {
        return this.userService.getUserInitialData(user);
    }

    @Patch('profile')
    @UseInterceptors(FileInterceptor('profile', {
        storage: multer.memoryStorage(),
    }))
    async updateProfile(@User() user: UserJwt, @Body() body: ProfileDto, 
    @UploadedFile('file') file: Express.Multer.File) {
        return this.userService.updateProfile(user, body, file);
    }

    @Patch('password')
    async updatePassword(@User() user: UserJwt, @Body() body: PasswordDto) {
        return this.userService.updatePassword(user, body);
    }

    @Patch('2fa')
    async update2fa(@User() user: UserJwt, @Body() body: TwoFADto) {
        return this.userService.update2FA(user, body);
    }

    @Patch('notification')
    async updateNotification(@User() user: UserJwt, @Body() body: NotificationDto) {
        return this.userService.updateNotification(user, body);
    }

    @Patch("billingInfo")
    async updateBillingInfo(@User() user: UserJwt, @Body() body: BillingInfoDto) {
        return this.userService.updateBillingInfo(user, body);
    }
}
