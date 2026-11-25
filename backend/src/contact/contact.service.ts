import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { EmailSenderService } from 'src/email-sender/email-sender.service';
import { ContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
    constructor(
        private readonly emailSenderService: EmailSenderService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) {}

    // at most 5 messages an hour from one visitor so the inbox can't be flooded
    async sendMessage(body: ContactDto, ip: string) {
        const key = `contact-${ip}`;
        const count = (await this.cacheManager.get<number>(key)) ?? 0;

        if(count >= 5) {
            throw new HttpException({ name: 'contact', message: 'Too many messages. Please try again later.' }, HttpStatus.TOO_MANY_REQUESTS);
        }

        await this.cacheManager.set(key, count + 1, 60 * 60 * 1000);
        await this.emailSenderService.sendContactEmail(body.name, body.email, body.message);

        return { message: 'Message sent' };
    }
}
