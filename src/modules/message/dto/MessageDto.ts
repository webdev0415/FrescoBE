'use strict';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/AbstractDto';
import { MessageEntity } from '../message.entity';

export class MessageDto extends AbstractDto {
    @ApiProperty()
    boardId: string;

    @ApiProperty()
    senderId: string;

    @ApiPropertyOptional()
    message: string;

    constructor(messageEntity: MessageEntity) {
        super(messageEntity);
        this.senderId = messageEntity.senderId;
        this.boardId = messageEntity.boardId;
        this.message = messageEntity.message;
    }
}
