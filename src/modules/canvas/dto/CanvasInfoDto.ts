'use strict';

import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsNotEmpty, IsString} from 'class-validator';

import {CategoryEntity} from '../../../modules/category/category.entity';

// import { UploadImageEntity } from '../../../modules/upload/upload-image.entity';

export class CanvasInfoDto {
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

    @ApiPropertyOptional()
    category: CategoryEntity;

    // @ApiPropertyOptional()
    // image: UploadImageEntity;

    path: string;
}
