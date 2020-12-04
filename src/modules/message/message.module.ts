import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BoardGateway } from '../../gateway/board/board.gateway';
import { BoardUserOrgRepository } from '../board-user-org/board-user-org.repository';
import { MessageController } from './message.controller';
import { MessageRepository } from './message.repository';
import { MessageService } from './message.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([MessageRepository, BoardUserOrgRepository]),
    ],
    controllers: [MessageController],
    providers: [MessageService, BoardGateway],
    exports: [MessageService, BoardGateway],
})
export class MessageModule {}
