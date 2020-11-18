/* eslint-disable @typescript-eslint/no-unused-vars */
// import { UserToOrgEntity } from '../user-org/user-org.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    UpdateDateColumn,
} from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { InvitationType } from '../../common/constants/invitation-type';
import { PermissionEnum } from '../../common/constants/permission';
import { OrganizationEntity } from '../../modules/organization/organization.entity';
import { InvitationTypeLinkDto } from './dto/InvitationTypeLinkDto';

@Entity({ name: 'invitation_type_link' })
export class InvitationTypeLinkEntity extends AbstractEntity<
    InvitationTypeLinkDto
> {
    @Column({ nullable: false, name: 'orgId' })
    orgId: string;

    @Column({ name: 'createUserId' })
    createUserId: string;

    @Column({ default: false })
    numberOfUsers: number;

    @Column({ name: 'typeId' })
    typeId: string;

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

    @OneToOne((organization) => OrganizationEntity)
    @JoinColumn({ name: 'orgId' })
    organization?: OrganizationEntity;

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

    // @OneToMany(
    //     (type) => UserToOrgEntity,
    //     (userToOrgEntity) => userToOrgEntity.user,
    // )
    // orgs?: UserToOrgEntity[];

    dtoClass = InvitationTypeLinkDto;
}
