import { HttpException } from '@nestjs/common';
import { EmailSenderService } from 'src/email-sender/email-sender.service';
import { ContactService } from './contact.service';

describe('ContactService', () => {
    const body = { name: 'Juan', email: 'juan@example.com', message: 'Hello, I would like to ask about CondoPal.' };

    const createService = () => {
        const store = new Map<string, unknown>();
        const cache = {
            get: jest.fn(async (key: string) => store.get(key)),
            set: jest.fn(async (key: string, value: unknown) => { store.set(key, value) }),
        };
        const emailSender = { sendContactEmail: jest.fn().mockResolvedValue(undefined) };

        return { service: new ContactService(emailSender as any, cache as any), emailSender };
    };

    it('queues the email', async () => {
        const { service, emailSender } = createService();

        await expect(service.sendMessage(body, '1.1.1.1')).resolves.toEqual({ message: 'Message sent' });
        expect(emailSender.sendContactEmail).toHaveBeenCalledWith(body.name, body.email, body.message);
    });

    it('blocks the 6th message from the same visitor within an hour', async () => {
        const { service, emailSender } = createService();

        for(let i = 0; i < 5; i++) {
            await service.sendMessage(body, '1.1.1.1');
        }

        await expect(service.sendMessage(body, '1.1.1.1')).rejects.toBeInstanceOf(HttpException);
        await expect(service.sendMessage(body, '2.2.2.2')).resolves.toEqual({ message: 'Message sent' });
        expect(emailSender.sendContactEmail).toHaveBeenCalledTimes(6);
    });
});

describe('EmailSenderService.processContactEmail', () => {
    it('escapes the visitor text and replies to the visitor', async () => {
        const config = { get: (key: string) => key === 'CONTACT_EMAIL' ? 'inbox@example.com' : undefined };
        const service = new EmailSenderService(config as any, {} as any);
        const sendEmail = jest.spyOn(service, 'sendEmail').mockResolvedValue(undefined as any);

        await service.processContactEmail('<b>Juan</b>', 'juan@example.com', '<script>alert(1)</script>');

        const [to, , , html, options] = sendEmail.mock.calls[0];
        expect(to).toBe('inbox@example.com');
        expect(html).not.toContain('<script>');
        expect(html).toContain('&#60;script&#62;');
        expect(options).toEqual({ replyTo: 'juan@example.com' });
    });
});
