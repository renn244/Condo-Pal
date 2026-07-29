import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { GeneralGateway } from "src/general-gateway/general.gateway";
import { PrismaService } from "src/prisma/prisma.service";

@Processor("notification", { concurrency: 3 })
export class NotificationProcessor extends WorkerHost {
    private readonly logger = new Logger(NotificationProcessor.name);

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
            // The database row is the durable notification. A disconnected or
            // failing socket must not retry the completed database insert.
            try {
                this.generalGateway.io.to(socketId).emit("newNotification", notification);
            } catch (error) {
                const socketError = error instanceof Error ? error : new Error(String(error));
                this.logger.error(
                    `Failed to emit notification ${notification.id} to user ${userId}`,
                    socketError.stack,
                );
            }
        }
        
        return { success: true };
    }

    @OnWorkerEvent('active')
    onActive(job: Job) {
        this.logger.debug(`Notification job ${job.id} is now active.`);
    }

    @OnWorkerEvent('completed')
    onCompleted(job: Job) {
        this.logger.debug(`Notification job ${job.id} completed successfully.`);
    }

    @OnWorkerEvent('failed')
    onFailed(job: Job, error: Error) {
        this.logger.error(`Notification job ${job.id} failed with error: ${error.message}`, error.stack);
    }

    @OnWorkerEvent('error')
    onError(error: Error) {
        this.logger.error(`Notification worker error: ${error.message}`, error.stack);
    }
}
