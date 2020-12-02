import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessageController } from './message.controller';
import { BoardUserOrgRepository } from '../board-user-org/board-user-org.repository';
import { MessageRepository } from './message.repository';
import { MessageService } from './message.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([MessageRepository, BoardUserOrgRepository]),
    ],
    controllers: [MessageController],
    providers: [MessageService],
    exports: [MessageService],
})
export class MessageModule {}
