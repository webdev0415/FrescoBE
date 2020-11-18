/* eslint-disable @typescript-eslint/no-unused-vars */
// import { UserToOrgEntity } from '../user-org/user-org.entity';
import { Column, CreateDateColumn, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { InvitationType } from '../../common/constants/invitation-type';
import { PermissionEnum } from '../../common/constants/permission';
import { InvitationTypeLinkDto } from './dto/InvitationTypeLinkDto';

@Entity({ name: 'invitation_type_link' })
export class InvitationTypeLinkEntity extends AbstractEntity<
    InvitationTypeLinkDto
> {
    @Column({ nullable: false, name: 'orgId' })
    orgId: string;

    @Column({ name: 'createdUserId' })
    createdUserId: string;

    @Column({ name: 'numberOfUser' })
    numberOfUser: number;

    @Column({ name: 'typeId' })
    typeId: string;

    @Column({ name: 'isDeleted' })
    isDeleted: boolean;

    @Column({})
    token: string;

    @Column({
        type: 'enum',
        enum: PermissionEnum,
    })
    public permission: PermissionEnum;

    @Column({
        type: 'enum',
        enum: InvitationType,
    })
    public type: InvitationType;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'createdAt',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    dtoClass = InvitationTypeLinkDto;
}
