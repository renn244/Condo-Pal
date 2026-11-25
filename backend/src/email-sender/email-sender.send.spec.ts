import { EmailSenderService } from './email-sender.service';

describe('EmailSenderService.sendEmail (Resend)', () => {
    const createService = (apiKey?: string) => {
        const env = { RESEND_API_KEY: apiKey, EMAIL_FROM: 'noreply@example.com' };
        return new EmailSenderService({ get: (key: string) => env[key] } as any, {} as any);
    };
    const fetchMock = jest.fn();

    beforeEach(() => {
        fetchMock.mockReset();
        global.fetch = fetchMock as any;
    });

    it('posts the email to Resend with the api key', async () => {
        fetchMock.mockResolvedValue({ ok: true, json: async () => ({ id: 'abc' }) });

        await expect(createService('re_test').sendEmail('juan@example.com', 'Hi', 'Hi', '<p>Hello</p>', { replyTo: 'ana@example.com' }))
            .resolves.toEqual({ id: 'abc' });

        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toBe('https://api.resend.com/emails');
        expect(init.headers.Authorization).toBe('Bearer re_test');
        expect(JSON.parse(init.body)).toEqual({
            from: 'CondoPal <noreply@example.com>',
            to: ['juan@example.com'],
            subject: 'Hi',
            html: '<p>Hello</p>',
            reply_to: 'ana@example.com',
        });
    });

    it('throws when Resend rejects the email', async () => {
        fetchMock.mockResolvedValue({ ok: false, status: 401, text: async () => 'API key is invalid' });

        await expect(createService('bad').sendEmail('juan@example.com', 'Hi', 'Hi', '<p>Hello</p>')).rejects.toThrow('401 API key is invalid');
    });

    it('throws without calling Resend when the key is missing', async () => {
        await expect(createService(undefined).sendEmail('juan@example.com', 'Hi', 'Hi', '<p>Hello</p>')).rejects.toThrow('RESEND_API_KEY');
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
