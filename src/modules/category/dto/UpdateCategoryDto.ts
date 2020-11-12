'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateCategoryDto {
    id: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    name: string;
}
