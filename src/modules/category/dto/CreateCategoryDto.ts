'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
    @ApiPropertyOptional()
    @IsNotEmpty()
    name: string;
}
