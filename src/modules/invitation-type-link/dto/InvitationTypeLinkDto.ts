'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { InvitationType } from '../../../common/constants/invitation-type';
import { PermissionEnum } from '../../../common/constants/permission';
import { AbstractDto } from '../../../common/dto/AbstractDto';
import { InvitationTypeLinkEntity } from '../invitation-type-link.entity';

export class InvitationTypeLinkDto extends AbstractDto {
    name?: string;

    organizationName?: string;

    @ApiPropertyOptional()
    createdUserId: string;

    @ApiPropertyOptional()
    orgId: string;

    @ApiPropertyOptional()
    numberOfUsers: number;

    @ApiPropertyOptional()
    token: string;

    @ApiPropertyOptional()
    permission: PermissionEnum;

    @ApiPropertyOptional()
    type: InvitationType;

    @ApiPropertyOptional()
    typeId: string;

    constructor(invitation: InvitationTypeLinkEntity) {
        super(invitation);
        // this.name = invitation.user?.name;
        this.orgId = invitation.orgId;
        // this.toUserId = invitation.toUserId;
        // this.organizationName = invitation.organization?.name;
        // this.toEmail = invitation.toEmail;
        this.token = invitation.token;
        this.permission = invitation.permission;
    }
}
