import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { PermissionEnum } from '../../common/constants/permission';
import { BoardUserOrgDto } from './dto/BoardUserOrgDto';

@Entity({ name: 'board_user_org' })
export class BoardUserOrgEntity extends AbstractEntity<BoardUserOrgDto> {
    @Column({ name: 'boardId' })
    boardId: string;

    @Column({ name: 'orgId' })
    orgId: string;

    @Column({ name: 'userId' })
    userId: string;

    @Column({
        type: 'enum',
        enum: PermissionEnum,
    })
    public permission: PermissionEnum;

    dtoClass = BoardUserOrgDto;
}
