'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { UploadImageEntity } from '../../../modules/upload/upload-image.entity';

export class CreateCanvasDto {
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
    @IsString()
    categoryId: string;

    @ApiPropertyOptional()
    @IsOptional()
    image: UploadImageEntity;
}
