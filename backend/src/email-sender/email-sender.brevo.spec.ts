import { EmailSenderService } from './email-sender.service';

describe('EmailSenderService.sendEmail (Brevo)', () => {
    const createService = (apiKey?: string) => {
        const env = { BREVO_API_KEY: apiKey, EMAIL_FROM: 'sender@example.com' };
        return new EmailSenderService({ get: (key: string) => env[key] } as any, {} as any);
    };
    const fetchMock = jest.fn();

    beforeEach(() => {
        fetchMock.mockReset();
        global.fetch = fetchMock as any;
    });

    it('posts the email to Brevo with the api key', async () => {
        fetchMock.mockResolvedValue({ ok: true, json: async () => ({ messageId: 'abc' }) });

        await expect(createService('xkeysib-test').sendEmail('juan@example.com', 'Hi', 'Hi', '<p>Hello</p>', { replyTo: 'ana@example.com' }))
            .resolves.toEqual({ messageId: 'abc' });

        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toBe('https://api.brevo.com/v3/smtp/email');
        expect(init.headers['api-key']).toBe('xkeysib-test');
        expect(JSON.parse(init.body)).toEqual({
            sender: { name: 'CondoPal', email: 'sender@example.com' },
            to: [{ email: 'juan@example.com' }],
            subject: 'Hi',
            htmlContent: '<p>Hello</p>',
            replyTo: { email: 'ana@example.com' },
        });
    });

    it('throws when Brevo rejects the email', async () => {
        fetchMock.mockResolvedValue({ ok: false, status: 401, text: async () => 'Key not found' });

        await expect(createService('bad').sendEmail('juan@example.com', 'Hi', 'Hi', '<p>Hello</p>')).rejects.toThrow('401 Key not found');
    });

    it('throws without calling Brevo when the key is missing', async () => {
        await expect(createService(undefined).sendEmail('juan@example.com', 'Hi', 'Hi', '<p>Hello</p>')).rejects.toThrow('BREVO_API_KEY');
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
