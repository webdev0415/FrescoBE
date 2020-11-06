'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCanvasDto {
    @ApiPropertyOptional()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    orgId: string;

    @ApiPropertyOptional()
    @IsString()
    createdUserId: string;

    @ApiPropertyOptional()
    @IsString()
    data: string;
}