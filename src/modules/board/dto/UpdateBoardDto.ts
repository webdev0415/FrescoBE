'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateBoardDto {
    id: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    orgId: string;

    @ApiPropertyOptional()
    data: string;
}
