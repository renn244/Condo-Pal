import { BadRequestException, GoneException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterLandLordDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { ValidationException } from 'src/lib/exception/validationException';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport-google-oauth20';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) {}

    async check(user: any) {
        return user
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
            sub: user.id,
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
}
