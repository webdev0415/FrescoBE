'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateDefaultTemplateDto {
    id: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    data: string;

    @ApiPropertyOptional()
    @IsString()
    categoryId: string;

    @ApiPropertyOptional()
    @IsString()
    imageId: string;

    path: string;
}
