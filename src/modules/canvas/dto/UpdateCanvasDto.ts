'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCanvasDto {
    id: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    orgId: string;

    @ApiPropertyOptional()
    @IsString()
    data: string;

    @ApiPropertyOptional()
    @IsString()
    imageId: string;
}
