'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class MessageInfoDto {
    @ApiPropertyOptional()
    @IsNotEmpty()
    boardId: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    senderId: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    message: string;
}
