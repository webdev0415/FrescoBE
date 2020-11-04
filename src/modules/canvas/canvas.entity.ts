import { Column, Entity } from 'typeorm';

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

    dtoClass = CanvasDto;
}