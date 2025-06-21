import { OnWorkerEvent, Processor , WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { EmailSenderService } from "./email-sender.service";

@Processor("email")
export class EmailProcessor extends WorkerHost {
    constructor(
        private readonly emailSenderService: EmailSenderService
    ) { super(); }

    async process(job: Job, token?: string): Promise<any> {
        switch(job.name) {
            case "dueReminder":
                const { email, leaseAgreement } = job.data;
                return this.emailSenderService.processDueReminderEmail(email, leaseAgreement); 
            case "resetPassword":
                const { email: resetEmail, token: resetToken } = job.data;
                return this.emailSenderService.processResetPasswordEmail(resetEmail, resetToken);
            case "assignedWorker":
                const { email: workerEmail, maintenance, token } = job.data;
                return this.emailSenderService.processAssignedWorkerMaintenanceEmail(workerEmail, maintenance, token);
            }
    }

    @OnWorkerEvent('active')
    onActive(job: Job) {
        console.log(`Email job ${job.id} is now active.`);
    }

    @OnWorkerEvent('completed')
    onCompleted(job: Job) {
        console.log(`Email job ${job.id} completed successfully.`);
    }

    @OnWorkerEvent('failed')
    onFailed(job: Job, error: Error) {
        console.error(`Email job ${job.id} failed with error: ${error.message}`);
    }
}