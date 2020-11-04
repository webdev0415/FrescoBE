import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { BoardDto } from './dto/BoardDto';

@Entity({ name: 'board' })
export class BoardEntity extends AbstractEntity<BoardDto> {
    @Column({})
    name: string;

    @Column({})
    orgId: string;

    @Column({})
    createdUserId: string;

    @Column({})
    data: string;

    dtoClass = BoardDto;
}
