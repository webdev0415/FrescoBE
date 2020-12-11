import { UseFilters } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';

import { BoardEventEnum } from '../../common/constants/board-event';
import { WsExceptionFilter } from '../../common/filters/ws-exception.filter';
import { UserService } from '../../modules/user/user.service';
import { ConfigService } from '../../shared/services/config.service';
import { BoardEventDto } from './dto/board-event.dto';

// @UseGuards(SocketGuard)
@UseFilters(new WsExceptionFilter())
@WebSocketGateway({ namespace: '/board', transports: ['websocket'] })
export class BoardGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly _configService: ConfigService,
        private readonly _userService: UserService,
    ) {}
    @WebSocketServer()
    server: Server;

    @SubscribeMessage(BoardEventEnum.CREATE)
    create(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: BoardEventDto,
    ): void {
        this.boardcastToBoardId(client, BoardEventEnum.CREATE, data);
    }

    @SubscribeMessage(BoardEventEnum.JOIN_BOARD)
    joinBoard(
        @ConnectedSocket() client: Socket,
        @MessageBody() boardId: string,
    ): void {
        client.join(boardId);
        client.emit(BoardEventEnum.JOIN_BOARD, boardId);
    }

    @SubscribeMessage(BoardEventEnum.LEAVE_BOARD)
    leaveBoard(
        @ConnectedSocket() client: Socket,
        @MessageBody() boardId: string,
    ): void {
        client.leave(boardId);
        client.emit(BoardEventEnum.LEAVE_BOARD, boardId);
    }

    @SubscribeMessage(BoardEventEnum.UPDATE)
    update(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: BoardEventDto,
    ): void {
        this.boardcastToBoardId(client, BoardEventEnum.UPDATE, data);
    }

    @SubscribeMessage(BoardEventEnum.MOVE)
    move(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: BoardEventDto,
    ): void {
        this.boardcastToBoardId(client, BoardEventEnum.MOVE, data);
    }

    @SubscribeMessage(BoardEventEnum.DELETE)
    delete(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: BoardEventDto,
    ): any {
        this.boardcastToBoardId(client, BoardEventEnum.DELETE, data);
    }

    @SubscribeMessage(BoardEventEnum.UNLOCK)
    unlock(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: BoardEventDto,
    ): any {
        this.boardcastToBoardId(client, BoardEventEnum.UNLOCK, data);
    }

    @SubscribeMessage(BoardEventEnum.LOCK)
    lock(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: BoardEventDto,
    ): any {
        this.boardcastToBoardId(client, BoardEventEnum.LOCK, data);
    }

    async handleConnection(client: Socket) {
        try {
            const token: string = client.handshake?.query?.token;
            if (!token) {
                throw new WsException('Missing token');
            }
            const decoded = jwt.verify(
                token,
                this._configService.get('JWT_SECRET_KEY'),
            ) as any;

            const user = await this._userService.findOne(decoded.id);
            if (!user) {
                throw new WsException('Token not valid');
            }
        } catch (err) {
            throw new WsException(err.message);
        }
        console.log('connected');
    }

    handleDisconnect() {
        console.log('disconnect');
    }

    boardcastToBoardId(socket: Socket, eventName: string, data: BoardEventDto) {
        if (socket) {
            socket.broadcast.to(data.boardId).emit(eventName, data.data);
        } else {
            this.server.to(data.boardId).emit(eventName, data.data);
        }
    }
}
