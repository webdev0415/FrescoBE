import { Column, Entity } from 'typeorm';

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

    dtoClass = BoardDto;
}
