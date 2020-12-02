'use strict';

import { ApiProperty } from '@nestjs/swagger';

export class DeleteMessageDto {
    @ApiProperty()
    boardId: string;
}
