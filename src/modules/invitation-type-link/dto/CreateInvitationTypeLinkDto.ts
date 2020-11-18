'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { InvitationType } from '../../../common/constants/invitation-type';
import { PermissionEnum } from '../../../common/constants/permission';

export class CreateInvitationTypeLinkDto {
    @ApiPropertyOptional()
    @IsNotEmpty()
    createdUserId: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    orgId: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    numberOfUsers: number;

    @ApiPropertyOptional()
    @IsNotEmpty()
    token: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    permission: PermissionEnum;

    @ApiPropertyOptional()
    @IsNotEmpty()
    type: InvitationType;

    typeId?: string;
}
