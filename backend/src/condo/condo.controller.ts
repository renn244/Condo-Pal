import { Body, Controller, Delete, Get, HttpStatus, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { User, UserJwt } from 'src/lib/decorators/User.decorator';
import { SubscriptionGuard } from 'src/lib/guards/Subscription.guard';
import { JwtAuthGuard } from 'src/passport/jwt.strategy';
import { CondoService } from './condo.service';
import { CreateCondoDto } from './dto/condo.dto';
import { LandLordGuard } from 'src/lib/guards/LandLord.guard';

@UseGuards(JwtAuthGuard, LandLordGuard, SubscriptionGuard)
@Controller('condo')
export class CondoController {
    constructor(
        private readonly condoService: CondoService,
    ) {}

    @Post()
    @UseInterceptors(FileInterceptor('photo', {
        storage: multer.memoryStorage()
    }))
    async createCondo(@User() user: UserJwt, @Body() body: CreateCondoDto, @UploadedFile() photo: Express.Multer.File) {
        return this.condoService.createCondo(user, body, photo);
    }

    @Get('getMainDashboardSummary')
    async getMainDashboardSummary(@User() user: UserJwt) {
        return this.condoService.getMainDashboardSummary(user);
    }

    @Get('getCondoOverview')
    async getCondoOverview(@User() user: UserJwt) {
        return this.condoService.getCondoOverview(user);
    } 

    @Get('getMyCondos')
    async getMyCondos(@Query('page', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) page: number,
    @User() user: UserJwt) {
        return this.condoService.getMyCondos(user, page);
    }

    @Get('getMyCondoList')
    async getMyCondoList(@User() user: UserJwt, @Query('page') page: number) {
        return this.condoService.getMyCondoList(user, page);
    }

    @Get('getViewCondo')
    async getViewCondo(@Query('condoId') condoId: string, @User() user: UserJwt) {
        return this.condoService.getViewCondo(condoId, user);
    }

    @Get()
    async getCondo(@Query('condoId') condoId: string) {
        return this.condoService.getCondo(condoId);
    }

    @Patch()
    @UseInterceptors(FileInterceptor('photo', {
        storage: multer.memoryStorage()
    }))
    async updateCondo(@User() user: UserJwt, @Body() body: CreateCondoDto, @Query('condoId') condoId: string, @UploadedFile() photo: Express.Multer.File) {
        return this.condoService.updateCondo(condoId, body, photo, user);
    }

    @Delete()
    async deleteCondo(@User() user: UserJwt, @Query('condoId') condoId: string) {
        return this.condoService.deleteCondo(condoId, user);
    }
}
