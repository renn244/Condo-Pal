import { Logger } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway()
export class GeneralGateway implements OnGatewayConnection, OnGatewayDisconnect {
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

        this.logger.log(`User ${userId} connected with socker ${client.id}`);
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
}