import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterLandLordDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { ValidationException } from 'src/lib/exception/validationException';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) {}

    async check(user: any) {
        return user
    }

    async validateLocalLogin({ email, password }: LoginDto) {
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

    async login(user: User) {
        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            
            isOauth: user.isOAuth,
            provider: user.provider,

            createdAt: user.createdAt,
        }
        // might want to add refresh token for remember me feature

        return {
            access_token: this.jwtService.sign(payload, { expiresIn: '30d' }), // 30 days
        }
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
        
        return {
            id: createLandlordAccount.id,
            email: createLandlordAccount.email,
            name: createLandlordAccount.name,
            createdAt: createLandlordAccount.createdAt,
            updatedAt: createLandlordAccount.updatedAt,
        }
    }

    // is this supposed to be automated like format or the landlord should
    // input the data
    async registerTenant() {
        
    }
}
