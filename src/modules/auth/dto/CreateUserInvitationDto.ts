'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserInvitationDto {
    @IsString()
    @IsEmail()
    @ApiProperty()
    readonly email: string;

    @IsString()
    @ApiProperty()
    readonly password: string;

    // @IsString()
    // @ApiProperty()
    // readonly name: string;

    orgId: string;

    verified: boolean;
}
