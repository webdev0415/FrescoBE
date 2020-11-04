'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';


export class DeleteBoardDto {
    @ApiPropertyOptional()
    boardId: string;

    @ApiPropertyOptional()
    orgId: string;

    @ApiPropertyOptional()
    userId: string;
}
