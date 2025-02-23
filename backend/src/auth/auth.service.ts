import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, GoneException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import { Profile } from 'passport-google-oauth20';
import { EmailSenderService } from 'src/email-sender/email-sender.service';
import { UserJwt } from 'src/lib/decorators/User.decorator';
import { ValidationException } from 'src/lib/exception/validationException';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { ForgotPasswordDto, RegisterLandLordDto, ResetPasswordForgotPasswordDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly emailSender: EmailSenderService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) {}

    async check(user: UserJwt) {
        const getCacheUser = await this.cacheManager.get(user.id) //getting the cache

        if(getCacheUser) {
            return getCacheUser;
        }

        const getUser = await this.prisma.user.findUnique({
            where: {
                id: user.id
            },
            select: {
                id: true,
                email: true,
                profile: true,
                name: true,
                role: true,
                isOAuth: true,
                provider: true,
                providerId: true,
                createdAt: true,
                updatedAt: true,
                subscriptions: {
                    select: {
                        id: true,
                        type: true,
                        createdAt: true,
                        expiresAt: true
                    },
                    take: 1,
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        })

        if(!getUser) {
            throw new UnauthorizedException();
        }

        await this.cacheManager.set(getUser?.id, getUser) // caching it

        return getUser
    }

    // google login
    async validateGoogleLogin(user: Profile) {
        const getUser = await this.prisma.user.findFirst({
            where: {
                AND: [
                   { provider: "google" },
                   { providerId: user.id }
                ]
            }
        })

        if(!getUser) {
            const createUser = await this.prisma.user.create({
                data: {
                    name: user.displayName,
                    email: user.emails![0].value,
                    provider: "google",
                    providerId: user.id,
                    isOAuth: true,
                    profile: user.photos![0].value || null,
                }
            })

            return this.login(createUser, true);
        }

        return this.login(getUser, true);
    }

    // local login
    async validateLocalLogin({ email, password }: { email: string, password: string }) {
        const getUser = await this.prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if(!getUser) {
            throw new ValidationException({
                field: "email",
                message: ["User does not exist"]
            });
        }

        // if it's not local then most likely it does not have a password also
        if(getUser.provider !== "local" || !getUser.password) {
            throw new BadRequestException({
                name: "General Error",
                message: "You need to login with your provider(Google)"
            });
        }
    
        const comparePassword = await bcrypt.compare(password, getUser.password);

        if(!comparePassword) {
            throw new ValidationException({
                field: "password",
                message: ["invalid password"]
            })
        }

        return getUser
    }

    async login(user: User, rememberMe: boolean = false) {
        const payload = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            
            isOauth: user.isOAuth,
            provider: user.provider,

            createdAt: user.createdAt,
        }

        // if rememberMe is true then generate a refresh token
        // so that when the access token expires the user can still login
        let refresh_token: string | undefined = undefined;
        if(rememberMe) {
            refresh_token = await this.generateRefreshToken(user.id);
        }

        return {
            access_token: this.jwtService.sign(payload, { expiresIn: '30d' }), // 30 days
            refresh_token
        }
    }

    async generateRefreshToken(userId: string) {
        if(!userId) {
            throw new GoneException('userId does not exist')
        }

        const deleteRefreshToken = await this.prisma.refreshToken.deleteMany({
            where: {
                userId: userId
            }
        })

        
        const refresh_token = uuidv4();
        const saveRefreshToken = await this.prisma.refreshToken.create({
            data: {
                token: refresh_token,
                userId: userId
            }
        })

        return refresh_token
    }

    async validateRefreshToken(refreshToken: string) {
        const getRefreshToken = await this.prisma.refreshToken.findFirst({
            where: {
                token: refreshToken
            }
        })

        if(!getRefreshToken) {
            throw new UnauthorizedException('refresh token does not exist')
        }

        const getUser = await this.prisma.user.findUnique({
            where: {
                id: getRefreshToken.userId
            }
        })

        if(!getUser) {
            throw new UnauthorizedException('user does not exist')
        }
        
        return this.login(getUser, true)
    }

    async registerLandlord(body: RegisterLandLordDto) {
        const hashedPassword = await bcrypt.hash(body.password, 10);

        const createLandlordAccount = await this.prisma.user.create({
            data: {
                email: body.email,
                name: body.name,
                password: hashedPassword,
                provider: "local"
            }
        })
        
        // make a confirmation email
        return this.login(createLandlordAccount);
    }

    // is this supposed to be automated like format or the landlord should
    // input the data
    async registerTenant() {
        
    }

    // forgot password
    async createResetPasswordToken(userId: string) {
        try {
            const token = uuidv4();
            const saveTokenTransaction = await this.prisma.$transaction(async (txprisma) => {
                // delete all the token connected to the user
                await txprisma.resetPassword.deleteMany({
                    where: {
                        userId: userId
                    }
                })

                // save the token to the database
                const saveToken = await txprisma.resetPassword.create({
                    data: {
                        token: token,
                        userId: userId,
                        expiresAt: new Date(Date.now() + 1000 * 60 * 60)
                    }
                })

                return saveToken
            })

            return saveTokenTransaction
        } catch (error) {
            throw new GoneException({
                name: "General Error",
                message: "An error occurred"
            })
        }
    }
    
    async forgotPassword(body: ForgotPasswordDto) {
        const getUser = await this.prisma.user.findUnique({
            where: {
                email: body.email
            },
            select: {
                id: true,
                email: true,
                isOAuth: true,
                provider: true
            }
        })
        
        if(!getUser) {
            throw new ValidationException({
                field: "email",
                message: ["User does not exist"]
            })
        }

        if(getUser.isOAuth) {
            throw new ValidationException({
                field: "email",
                message: [`You're using ${getUser.provider}. Log in with your respective provider.`]
            })
        }

        // set a token for the user
        const saveToken = await this.createResetPasswordToken(getUser.id);

        // send an email to the user
        await this.emailSender.sendResetPasswordEmail(getUser.email, saveToken.token);

        return {
            message: "An email has been sent to your email"
        }
    }

    async resendForgotPassword(body: ForgotPasswordDto) {
        const getUser = await this.prisma.user.findUnique({
            where: {
                email: body.email
            },
            select: {
                id: true,
                email: true
            }
        })

        if(!getUser) {
            throw new ValidationException({
                field: "email",
                message: ["User does not exist"]
            })
        }
        const createResetPasswordToken = await this.createResetPasswordToken(getUser.id)

        await this.emailSender.sendResetPasswordEmail(getUser.email, createResetPasswordToken.token);

        return {
            message: 'An email has been resent to your email'
        }
    }

    async resetPasswordForgotPassword(body: ResetPasswordForgotPasswordDto) {
        // no need to match token because we are finding it by the token
        const getResetPassword = await this.prisma.resetPassword.findFirst({
            where: {
                token: body.token
            }
        })

        if(!getResetPassword) {
            throw new ValidationException({
                field: "token",
                message: ["Token does not exist"]
            })
        }

        if(new Date(getResetPassword.expiresAt).getTime() < Date.now()) {
            throw new ValidationException({
                field: "token",
                message: ["Token has expired"]
            })
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);
        const updateUserPassword = await this.prisma.user.update({
            where: {
                id: getResetPassword.userId
            },
            data: {
                password: hashedPassword
            }
        })

        // delete the resetToken
        await this.prisma.resetPassword.delete({
            where: {
                id: getResetPassword.id
            }
        })  

        return this.login(updateUserPassword, true)
    }
}