'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { InvitationType } from '../../../common/constants/invitation-type';
import { PermissionEnum } from '../../../common/constants/permission';

export class CreateInvitationTypeLinkDto {
    createdUserId: string;

    @ApiPropertyOptional()
    @IsNotEmpty({ message: 'orgId is required' })
    orgId: string;

    @ApiPropertyOptional()
    @IsNotEmpty({ message: 'numberOfUser is required' })
    numberOfUser: number;

    @ApiPropertyOptional()
    @IsNotEmpty({ message: 'token is required' })
    token: string;

    @ApiPropertyOptional()
    @IsNotEmpty({ message: 'permission is required' })
    permission: PermissionEnum;

    @ApiPropertyOptional()
    @IsNotEmpty({ message: 'type is required' })
    type: InvitationType;

    typeId?: string;
}
