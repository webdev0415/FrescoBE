import { UseFilters, UseGuards } from '@nestjs/common';
import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { BoardEventEnum } from '../../common/constants/board-event';
import { Server, Socket } from 'socket.io';

import { WsExceptionFilter } from '../../common/filters/ws-exception.filter';
import { SocketGuard } from '../../guards/socket.guard';

@UseGuards(SocketGuard)
@UseFilters(new WsExceptionFilter())
@WebSocketGateway({ namespace: '/board' })
export class BoardGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('create')
    create(@MessageBody() _data: any): WsResponse<any> {
        return null;
        // return this.boardcast(BoardEventEnum.CREATE, _data);
        // return from([1, 2, 3]).pipe(
        //     map((item) => ({ event: 'events', data: item })),
        // );
    }

    @SubscribeMessage('joinBoard')
    joinBoard(client: Socket, boardId: string): void {
        client.join(boardId);
        client.emit('joinedBoard', boardId)
    }

    @SubscribeMessage('leaveBoard')
    leaveBoard(client: Socket, boardId: string): void {
        client.leave(boardId);
        client.emit('leftBoard', boardId)
    }

    @SubscribeMessage('update')
    update(@MessageBody() data: any): any {
        console.log('1111');
        return { event: 'events', data };
    }

    @SubscribeMessage('move')
    move(@MessageBody() data: number): any {
        return data;
    }

    @SubscribeMessage('delete')
    delete(@MessageBody() data: number): any {
        return data;
    }

    async handleConnection() {
        console.log('connected');
    }

    async handleDisconnect() {
        console.log('disconnect');
    }

    boardcast(eventName: string, boardId: string, data: any) {
        return this.server.to(boardId).emit(eventName, data);
    }
}