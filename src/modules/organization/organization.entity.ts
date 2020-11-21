import { Column, Entity, OneToMany } from 'typeorm';

// Entities
import { AbstractEntity } from '../../common/abstract.entity';
import { CanvasUserOrgEntity } from '../../modules/canvas-user-org/canvas-user-org.entity';
import { UserToOrgEntity } from '../user-org/user-org.entity';
// import { PlanEntity } from '../plan/plan.entity';
// import { UserEntity } from '../user/user.entity';
// Dtos
import { OrganizationDto } from './dto/OrganizationDto';
import {BoardUserOrgEntity} from "../board-user-org/board-user-org.entity";

@Entity({ name: 'organization' })
export class OrganizationEntity extends AbstractEntity<OrganizationDto> {
    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false, name: 'fName' })
    fName: string;

    @Column({ nullable: false, name: 'lName' })
    lName: string;

    // @Column({ nullable: true })
    // planId: string;

    // @Column({ nullable: false, name: 'userId' })
    // userId: string;

    // @OneToMany(
    //     () => UserEntity,
    //     (user: UserEntity) => user.organization
    // )
    // users: UserEntity[];

    // @OneToMany(() => PlanEntity, (plan: PlanEntity) => plan.organization)
    // plans: PlanEntity[];

    @OneToMany(() => UserToOrgEntity, (userToOrgEntity) => userToOrgEntity.user)
    users?: UserToOrgEntity[];

    @OneToMany(
        () => CanvasUserOrgEntity,
        (canvasUserOrgEntity) => canvasUserOrgEntity.organization,
    )
    canvases?: CanvasUserOrgEntity[];


    @OneToMany(
        () => BoardUserOrgEntity,
        (boardUserOrgEntity) => boardUserOrgEntity.organization,
    )
    boards?: BoardUserOrgEntity[];

    // @OneToMany(
    //     () => CollaborationEntity,
    //     (collaboration: CollaborationEntity) => collaboration.organization,
    // )
    // collaborations: CollaborationEntity[];

    dtoClass = OrganizationDto;
}
