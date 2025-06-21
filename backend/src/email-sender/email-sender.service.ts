import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { Queue } from 'bullmq';

@Injectable()
export class EmailSenderService{
  constructor(
    configSevice: ConfigService,
    @InjectQueue('email') private readonly emailQueue: Queue
  ){ 
    const sendgridApiKey = configSevice.get<string>('SENDGRID_API_KEY')
    if(!sendgridApiKey) throw new Error('SENDGRID_API_KEY is not defined')

    sgMail.setApiKey(sendgridApiKey)
  }

  async sendEmail(to: string, subject: string, title: string, content: string, options?: Partial<sgMail.MailDataRequired>) {
    const msg = {
      to: to,
      from: 'condopal.management@gmail.com',
      subject: subject,
      html: content,
      ...options
    } 

    try {
      const response = await sgMail.send(msg)
      return response
    } catch (error) {
      console.log(`Error sending email: ${error}`)
      throw Error(`Error sending email: ${error.message}`)
    }
  }
  
  async sendDueReminderEmail(email: string, leaseAgreement: any) {
    this.emailQueue.add('dueReminder', { email, leaseAgreement });
  }

  async processDueReminderEmail(email: string, leaseAgreement: any) {
    const baseUrl = process.env.CLIENT_BASE_URL;
    const photo = leaseAgreement.condo.photo;
    
    const isLastDayMonth = leaseAgreement.due_date === -1;
    const dueDate = isLastDayMonth ? new Date(
      new Date().getFullYear(), new Date().getMonth() + 1, 0
    ) : new Date(
      new Date().getFullYear(), new Date().getMonth(), leaseAgreement.due_date
    );

    this.sendEmail(
      email,
      "Condo Bill Due Reminder",
      "Condo Bill Due Reminder",
      `
        <div style="font-family: Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9;">
          <div style="text-align: center; padding-bottom: 10px; border-bottom: 2px solid #00466a;">
            <a href="${baseUrl}" style="font-size: 1.5em; color: #00466a; text-decoration: none; font-weight: 600;">CondoPal</a>
          </div>
          
          <div style="padding: 20px; background: #ffffff; border-radius: 8px; margin-top: 10px;">
            <p style="font-size: 1.2em; font-weight: 600; color: #333;">Dear Resident,</p>
            <p style="color: #555;">This is a friendly reminder that your condo bill is due soon(${dueDate.toDateString()}). Below are the details of your current charges:</p>
            
            <div style="text-align: center; margin: 15px 0;">
              <img src="${photo}" alt="Condo Image" style="max-width: 100%; border-radius: 8px; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);" />
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <tr>
                <td style="padding: 10px; font-weight: 600; color: #00466a;">Rent Amount:</td>
                <td style="padding: 10px; text-align: right; font-weight: 600; color: #333;">₱${leaseAgreement.condo.rentAmount}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: 600; color: #00466a;">Additional Fees:</td>
                <td style="padding: 10px; text-align: right; font-weight: 600; color: #333;">Unknown</td>
              </tr>
            </table>

            <p style="color: #ff0000; font-size: 0.9em; margin-top: 10px;">
              *Note: These charges are only for rent amount and additional fee's is not yet known until you decided to pay. So the total amount may vary.
            </p>

            <div style="text-align: center; margin-top: 20px;">
              <a href="${baseUrl}/billing" style="background: #00466a; color: #ffffff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: 600;">View Your Bill</a>
            </div>
          </div>

          <p style="font-size: 0.9em; color: #666; text-align: center; margin-top: 20px;">
            If you have any questions, please contact our support team.
          </p>
        </div>
      `
    )
  }

  async sendResetPasswordEmail(email: string, token: string) {
    this.emailQueue.add('resetPassword', { email, token });
  }

  async processResetPasswordEmail(email: string, token: string) {
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
            <p style="font-size:0.9em;">Regards,<br />CondoPal Team</p>
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

  async sendAssignedWorkerMaintenanceEmail(email: string, maintenance: any, token: string) {
    this.emailQueue.add('assignedWorker', { email, maintenance, token });
  }

  async processAssignedWorkerMaintenanceEmail(email: string, maintenance: any, token: string) {
    const baseUrl = process.env.CLIENT_BASE_URL;
    const name = email.split('@')[0];
    const taskLink = `${baseUrl}/maintenance/worker/${maintenance.id}?token=${token}`;

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "numeric" });
    }
  
    this.sendEmail(
      email,
      "New Maintenance Request Assigned",
      "New Maintenance Request Assigned",
      `
      <div style="font-family: Helvetica,Arial,sans-serif;width:600px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="${baseUrl}" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">CondoPal</a>
          </div>
          <p style="font-size:1.1em;margin: 8px 0 0 0;">Hi, ${name}</p>
          <p style="margin: 5px 0 0 0; font-size: 15px;">You've been assigned to a new maintenance task. Please see the details below.</p>

          <div style="background: #f9f9f9; padding: 10px; border: 1px solid #ddd; border-radius: 8px; margin: 10px 0;">
            <p style="margin: 2px 0;"><strong>Task:</strong> ${maintenance.title}</p>
            <p style="margin: 2px 0;"><strong>Location:</strong> ${maintenance.condo.address}</p>
            <p style="margin: 2px 0;"><strong>Requested Date:</strong> ${formatDate(new Date(maintenance.createdAt))}</p>
            <p style="margin: 2px 0;"><strong>Scheduled Time:</strong> ${formatDate(new Date(maintenance.scheduledDate))}</p>
            <p style="margin: 2px 0;"><strong>Description:</strong><br />${maintenance.description}</p>
          </div>

          <p style="margin: 5px 0;font-size: 14px;">Click the link so that you can see more details, chat the tenant and landlord as well as update the status in realtime</p>
          <a href="${taskLink}" style="display:inline-block;padding:5px 10px;background-color:#00466a;color:#ffffff;text-decoration:none;border-radius:5px;font-size: 14px;">View Task</a>

          <p style="font-size:0.9em;">Regards,<br />CondoPal Team</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:center;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>CondoPal</p>
            <p>Poblacion Sta Maria, Bulacan</p>
            <p>Philippines</p>
          </div>
        </div>
      </div>
      `,
    )
  }
}
