'use strict';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { PermissionEnum } from '../../../common/constants/permission';

export class SendInvitationDto {
    @IsString()
    @IsNotEmpty()
    @ApiPropertyOptional()
    orgId: string;

    @IsString()
    @ApiProperty()
    toUserId: string;

    @IsString()
    @IsNotEmpty()
    @ApiPropertyOptional()
    toEmail: string;

    @IsString()
    @ApiPropertyOptional()
    token: string;

    @IsEnum(PermissionEnum)
    @ApiPropertyOptional()
    permission: PermissionEnum;

    name?: string;

    organizationName?: string;
}
