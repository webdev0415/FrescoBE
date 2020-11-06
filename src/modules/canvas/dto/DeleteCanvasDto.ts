'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteCanvasDto {
    @ApiPropertyOptional()
    @IsNotEmpty()
    canvasId: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    orgId: string;
}
