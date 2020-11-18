import { Column, CreateDateColumn, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { RoleType } from '../../common/constants/role-type';
import { CanvasUserOrgEntity } from '../../modules/canvas-user-org/canvas-user-org.entity';
import { UserToOrgEntity } from '../user-org/user-org.entity';
import { UserDto } from './dto/UserDto';

@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity<UserDto> {
    @Column({ nullable: true })
    name: string;

    @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
    role: RoleType;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column({ default: false })
    verified: boolean;

    @Column({ nullable: true, name: 'googleId' })
    googleId: string;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'createdAt',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @OneToMany(() => UserToOrgEntity, (userToOrgEntity) => userToOrgEntity.user)
    orgs?: UserToOrgEntity[];

    @OneToMany(
        () => CanvasUserOrgEntity,
        (canvasUserOrgEntity) => canvasUserOrgEntity.user,
    )
    canvases?: CanvasUserOrgEntity[];

    dtoClass = UserDto;
}
