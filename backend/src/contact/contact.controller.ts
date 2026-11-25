import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ContactService } from './contact.service';
import { ContactDto } from './dto/contact.dto';

@Controller('contact')
export class ContactController {
    constructor(
        private readonly contactService: ContactService
    ) {}

    @Post()
    async sendMessage(@Body() body: ContactDto, @Req() req: Request) {
        // behind Render's proxy the visitor's IP is the first x-forwarded-for entry
        const forwarded = req.headers['x-forwarded-for'];
        const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0].trim() || req.ip || 'unknown';

        return this.contactService.sendMessage(body, ip);
    }
}
