import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { GeneralGateway } from "src/general-gateway/general.gateway";
import { PrismaService } from "src/prisma/prisma.service";

@Processor("notification", { concurrency: 3 })
export class NotificationProcessor extends WorkerHost {
    constructor(
        private readonly prisma: PrismaService,
        private readonly generalGateway: GeneralGateway,
    ) { super(); }

    async process(job: Job): Promise<any> {
        const { userId, type, title, message, link } = job.data;

        if(!userId) return;

        const notification = await this.prisma.notification.create({
            data: {
                type: type, title: title, 
                message: message, link: link, userId: userId
            }
        })

        const socketId = this.generalGateway.getSocketIdByUserId(userId);
        if(socketId) {
            this.generalGateway.io.to(socketId).emit("newNotification", notification);
        }
        
        return { success: true };
    }

    @OnWorkerEvent('active')
    onActive(job: Job) {
        console.log(`Notification job ${job.id} is now active.`);
    }

    @OnWorkerEvent('completed')
    onCompleted(job: Job) {
        console.log(`Notification job ${job.id} completed successfully.`);
    }

    @OnWorkerEvent('failed')
    onFailed(job: Job, error: Error) {
        console.error(`Notification job ${job.id} failed with error: ${error.message}`);
    }
}