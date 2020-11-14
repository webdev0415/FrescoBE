'use strict';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

// import { UploadImageEntity } from '../../../modules/upload/upload-image.entity';

export class CreateCanvasDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
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

    // image: UploadImageEntity;
    path: string;
}
