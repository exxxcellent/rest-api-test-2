import { NotFoundException } from '@nestjs/common';
import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
    EVENT_TRANSACTION_CREATED,
    EVENT_TRANSACTION_DELETED,
    EVENT_TRANSACTION_UPDATED,
    TRANSACTION_CREATED,
    TRANSACTION_DELETED,
    TRANSACTION_UPDATED,
    USER_NOT_FOUND,
} from 'src/common/constants';
import { TokenService } from 'src/token/token.service';
import { CreateTransactionDto } from 'src/transactions/dto/create.dto';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    constructor(
        private readonly tokenService: TokenService,
        private readonly userService: UserService,
    ) {}

    @WebSocketServer()
    server: Server;

    private connectedClients = new Map<number, Socket>();

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.query.token as string;
            const decodedToken =
                await this.tokenService.validateAccessToken(token);
            const user = await this.userService.getByEmail(decodedToken.email);
            if (!user) throw new NotFoundException(USER_NOT_FOUND);
            this.connectedClients.set(user.id, client);
        } catch (error) {
            console.log('Auth error:', error.message);
            client.disconnect();
        }
    }

    async handleDisconnect(client: Socket) {
        this.connectedClients.forEach((value, key) => {
            if (value === client) this.connectedClients.delete(key);
        });
    }

    sendNotification(
        userId: number,
        message: string,
        event: string = 'notification',
        data: unknown = {},
    ) {
        const client = this.connectedClients.get(userId);
        if (client) {
            client.emit(event, { message, data });
        }
    }

    @SubscribeMessage(EVENT_TRANSACTION_CREATED)
    async createTransaction(@MessageBody() body: CreateTransactionDto) {
        this.sendNotification(
            body.userId,
            TRANSACTION_CREATED,
            EVENT_TRANSACTION_CREATED,
        );
    }

    @SubscribeMessage(EVENT_TRANSACTION_UPDATED)
    async updateTransaction(@MessageBody() body: CreateTransactionDto) {
        this.sendNotification(
            body.userId,
            TRANSACTION_UPDATED,
            EVENT_TRANSACTION_UPDATED,
        );
    }

    @SubscribeMessage(EVENT_TRANSACTION_DELETED)
    async deleteTransaction(@MessageBody() body: CreateTransactionDto) {
        this.sendNotification(
            body.userId,
            TRANSACTION_DELETED,
            EVENT_TRANSACTION_DELETED,
        );
    }
}
