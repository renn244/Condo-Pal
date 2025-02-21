import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailSenderService{
  constructor(configSevice: ConfigService){ 
    const sendgridApiKey = configSevice.get<string>('SENDGRID_API_KEY')
    if(!sendgridApiKey) throw new Error('SENDGRID_API_KEY is not defined')

    sgMail.setApiKey(sendgridApiKey)
  }

  async sendEmail(to: string, subject: string, title: string, content: string, options?: Partial<sgMail.MailDataRequired>) {
    const msg = {
        to: to,
        from: 'renatodsantosjr9@gmail.com',
        subject: subject,
        html: content,
        ...options
    } 

    try {
        const response = await sgMail.send(msg)
        return response
    } catch (error) {
        console.log(`Error sending email: ${error.message}`)
    }
  }

  async sendResetPasswordEmail(email: string, token: string) {
    try {
      const baseUrl = process.env.CLIENT_BASE_URL;
      const magicLink = `${baseUrl}/forgot-password/reset?token=${token}&email=${email}`;
      this.sendEmail(
        email,
        "Reset Password",
        "Reset Password",
        `
        <div style="font-family: Helvetica,Arial,sans-serif;width:600px;overflow:auto;line-height:2">
          <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
              <a href="${baseUrl}" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">CondoPal</a>
            </div>
            <p style="font-size:1.1em">Hi,</p>
            <p>You are resetting your password. if this is you please click the link to reset your password</p>
            <a href="${magicLink}" 
            style="background: #00466a;margin: 0 auto;width: max-content;padding: 10px 20px;color: #fff;border-radius: 4px;">
              resetPassword
            </a>
            <p style="font-size:0.9em;">Regards,<br />STI-voting Team</p>
            <hr style="border:none;border-top:1px solid #eee" />
            <div style="float:center;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
              <p>CondoPal</p>
              <p>Poblacion Sta Maria, Bulacan</p>
              <p>Philippines</p>
            </div>
          </div>
        </div>
        `
      )
    } catch (error) {
      throw new InternalServerErrorException('Error sending email')
    }
  }
}
