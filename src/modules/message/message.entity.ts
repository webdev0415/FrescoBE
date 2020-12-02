import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { MessageDto } from './dto/MessageDto';

@Entity({ name: 'messages' })
export class MessageEntity extends AbstractEntity<MessageDto> {
    @Column({ name: 'boardId' })
    boardId: string;

    @Column({ name: 'senderId' })
    senderId: string;

    @Column({ name: 'message' })
    message: string;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'createdAt',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'updatedAt',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;

    dtoClass = MessageDto;
}
