import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { BoardDto } from './dto/BoardDto';

@Entity({ name: 'board' })
export class BoardEntity extends AbstractEntity<BoardDto> {
    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'orgId' })
    orgId: string;

    @Column({ name: 'createdUserId' })
    createdUserId: string;

    @Column({})
    data: string;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'createdAt',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'updatedAt',
        default: () => 'CURRENT_TIMESTAMP' 
    })
    updatedAt: Date;

    dtoClass = BoardDto;
}
