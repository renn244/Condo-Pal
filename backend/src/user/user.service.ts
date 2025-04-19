import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { truncateByDomain } from 'recharts/types/util/ChartUtils';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { UserJwt } from 'src/lib/decorators/User.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationDto, PasswordDto, ProfileDto, TwoFADto } from './dto/user.dto';
import { ValidationException } from 'src/lib/exception/validationException';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fileUploadService: FileUploadService
    ) {}

    // for settings
    async getUserInitialData(user: UserJwt) {
        const userData = await this.prisma.user.findUnique({
            where: {
                id: user.id
            },
            select: {
                id: true,
                name: true,
                profile: true,
                email: true,
                TwoFA: true,
            }
        })

        if(!userData) {
            throw new NotFoundException("User not found")
        }

        return userData
    }

    // updates
    async updateProfile(user: UserJwt, body: ProfileDto, file: Express.Multer.File) {
        let photo: string | undefined = undefined;
        if(file) {
            photo = (await this.fileUploadService.upload(file, { folder: 'Condopal/profile' })).secure_url
        }

        const updatedUser = await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                name: body.name,
                email: body.email,
                ...(photo ? {profile: photo} : {})
            },
            select: {
                id: true,
                name: true,
                profile: true,
                email: true,
            }
        })

        return updatedUser  
    }

    async updatePassword(user: UserJwt, body: PasswordDto) {
        if(body.newPassword !== body.confirmPassword) {
            throw new ValidationException({
                field: 'confirmPassword',
                message: ['Password and confirm password do not match']
            })
        }

        const password = await this.prisma.user.findUnique({
            where: { id: user.id },
            select: { password: true, provider: true }
        })

        if(password?.provider !== 'local') {
            throw new BadRequestException("Password can only be updated for local users")
        }

        if(!password?.password) {
            throw new NotFoundException("User not found")
        }

        const isPasswordValid = bcrypt.compareSync(body.password, password.password);

        if(!isPasswordValid) {
            throw new ValidationException({
                field: 'password',
                message: ['Password is incorrect']
            })
        }

        const hashedPassword = bcrypt.hashSync(body.newPassword, 10)

        await this.prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        })

        return {
            message: "Password updated successfully",
        };
    }

    async update2FA(user: UserJwt, body: TwoFADto) {
        // update 2FA settings in the database
        const updatedUser = await this.prisma.user.update({
            where: { id: user.id },
            data: {
                TwoFA: body.TwoFA,
            },
            select: { id: true, TwoFA: true },
        });


        return updatedUser;
    }

    async updateNotification(user: UserJwt, body: NotificationDto) {

        // update notification settings in the database
        // const updatedUser = await this.prisma.notificationPreferences.update({
        //     where: { id: user.id },
        //     data: {
        //        ...body
        //     },
        // });

        // return updatedUser;
    }

    async updateBilling(user: UserJwt, body: any) {

    }
}
