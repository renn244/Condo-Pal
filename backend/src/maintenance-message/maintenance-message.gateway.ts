import { Logger } from "@nestjs/common";
import { WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io"

@WebSocketGateway({ namespace: "maintenance-message" })
export class MaintenanceMessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private logger: Logger = new Logger(MaintenanceMessageGateway.name); 

    @WebSocketServer() io: Server;

    private socketIdToMaintenanceId: Record<string, string> = {};

    handleConnection(client: any, ...args: any[]) {
        // maybe for worker who is not logged it we can use the token
        const maintenanceId = client.handshake.query.maintenanceId;
        // join the room immidiately (room is base on maintenanceId)
        this.socketIdToMaintenanceId[client.id] = maintenanceId;
        client.join(maintenanceId);

        // logging the connection
        this.logger.log(`User ${client.id} connected in maintenance message ${maintenanceId}`);
    }

    handleDisconnect(client: any) {
        const maintenanceId = this.socketIdToMaintenanceId[client.id];
        client.leave(maintenanceId);

        if (maintenanceId) {
            delete this.socketIdToMaintenanceId[client.id];
            this.logger.log(`User ${client.id} disconnected in maintenance message ${maintenanceId}`);
        }
    }
}