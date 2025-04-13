import { Body, Controller, Get, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from 'src/passport/jwt.strategy';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { User, UserJwt } from 'src/lib/decorators/User.decorator';
import { query } from 'express';

@Controller('message')
@UseGuards(JwtAuthGuard)
export class MessageController {
    constructor(
        private readonly messageService: MessageService,
    ) {}

    @Post("send-message")
    @UseInterceptors(FilesInterceptor('attachments', undefined, {
        storage: multer.memoryStorage(),
    }))
    async sendMessageWithFile(@Query() query: { leaseAgreementId: string, receiverId: string }, @User() user: UserJwt,
    @Body() body: any, @UploadedFiles() attachments: Array<Express.Multer.File>) {
        return this.messageService.createMessageWithFile(query, user, body, attachments);
    }

    // need landlord guard
    @Get("getConversationListLandlord")
    async getActiveConversationListLandlord(@User() user: UserJwt, @Query() query: { search: string }) {
        return this.messageService.getActiveConversationListLandlord(user, query);
    }

    // need tenant guard
    @Get("getConversationListTenant")
    async getActiveConversationListTenant(@User() user: UserJwt, @Query() query: { search: string }) {
        return this.messageService.getActiveConversationListTenant(user, query);
    }

    @Get("getSelectedChatInfo")
    async getSelectedChatInfo(@Query() query: { leaseAgreementId: string }, @User() user: UserJwt) {
        return this.messageService.getSelectedChatInfo(query, user);
    }

    @Get("getMessages")
    async getMessages(@Query() query: { leaseAgreementId: string, cursor?: string }, @User() user: UserJwt) {
        return this.messageService.getMessages(query, user);
    }
}
