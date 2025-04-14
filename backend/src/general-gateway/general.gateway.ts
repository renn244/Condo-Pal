import { Logger } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server } from "socket.io";
import { PrismaService } from "src/prisma/prisma.service";

@WebSocketGateway()
export class GeneralGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    private logger: Logger = new Logger(GeneralGateway.name);

    @WebSocketServer() io: Server;

    private userIdToSocketId: Record<string, string> = {};
    private socketIdToUserId: Record<string, string> = {};

    getUserIdBySocketId(socketId: string) {
        return this.socketIdToUserId[socketId];
    }
    
    getSocketIdByUserId(userId: string) {
        return this.userIdToSocketId[userId];
    }

    handleConnection(client: any) {
        const userId = client.handshake.query.userId;
        this.userIdToSocketId[userId] = client.id;
        this.socketIdToUserId[client.id] = userId;

        this.logger.log(`User ${userId} connected with socket ${client.id}`);
    }

    handleDisconnect(client: any) {
        const socketId = client.id;
        const userId = this.getUserIdBySocketId(socketId);
        if(userId) {
            this.logger.log(`User ${userId} disconnected with socket ${socketId}`);
            delete this.userIdToSocketId[userId];
            delete this.socketIdToUserId[socketId];
        } else {
            this.logger.warn('attemp to disconnect a user that is not connected');
        }
    }

    @SubscribeMessage("seenMessageCondo")
    async handleSeenMessageCondo(client: any, data: { leaseAgreementId: string, messageId: string, senderId: string }) {
        const userId = this.getUserIdBySocketId(client.id);
        if(!userId) return;

        await this.prisma.message.update({
            where: {
                id: data.messageId,
                leaseAgreementId: data.leaseAgreementId,
                isRead: false,
            },
            data: { isRead: true },
        })

        // update the both about the seen message
        const senderSocketId = this.getSocketIdByUserId(data.senderId);
        const receiverSocketId = this.getSocketIdByUserId(userId);
        this.io.to([senderSocketId, receiverSocketId]).emit('seenMessageCondo', { leaseAgreementId: data.leaseAgreementId, messageId: data.messageId })

        return {
            message: "Message seen!",
            leaseAgreementId: data.leaseAgreementId,
        }
    }
}