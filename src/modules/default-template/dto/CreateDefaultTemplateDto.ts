'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDefaultTemplateDto {
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
    @IsOptional()
    imageId: string;

    path: string;
}
