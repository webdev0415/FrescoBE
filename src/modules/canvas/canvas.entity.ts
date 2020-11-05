import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { CanvasDto } from './dto/CanvasDto';

@Entity({ name: 'canvas' })
export class CanvasEntity extends AbstractEntity<CanvasDto> {
    @Column({})
    name: string;

    @Column({})
    orgId: string;

    @Column({})
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

    dtoClass = CanvasDto;
}