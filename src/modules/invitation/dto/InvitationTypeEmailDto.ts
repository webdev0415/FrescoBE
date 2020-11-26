import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PermissionEnum } from '../../../common/constants/permission';
import { InvitationType } from '../../../common/constants/invitation-type';

export class InVitationTypeEmailDto {
    @IsString()
    @IsNotEmpty({ message: 'orgId is required' })
    @ApiProperty()
    orgId: string;

    @IsString()
    @IsNotEmpty({ message: 'toUserId is required' })
    @ApiProperty()
    toUserId: string;

    @IsString()
    @IsNotEmpty({ message: 'toEmail is required' })
    @ApiProperty()
    toEmail: string;

    @IsString()
    @IsNotEmpty({ message: 'typeId is required' })
    @ApiProperty()
    typeId: string;

    @IsBoolean()
    @IsOptional()
    @ApiPropertyOptional()
    notify: boolean;

    @IsEnum(PermissionEnum)
    @IsNotEmpty({ message: 'permission is required' })
    @ApiProperty()
    permission: PermissionEnum;

    @IsEnum(InvitationType, { message: 'type is not valid' })
    @ApiProperty()
    @IsNotEmpty({ message: 'type is required' })
    type: InvitationType;
}
