'use strict';

import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsNotEmpty, IsOptional, IsString} from 'class-validator';

import {CategoryEntity} from '../../../modules/category/category.entity';

export class BoardInfoDto {
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
    @IsOptional()
    categoryId: string;

    @ApiPropertyOptional()
    @IsOptional()
    imageId: string;

    path: string;
    category: CategoryEntity;
}
