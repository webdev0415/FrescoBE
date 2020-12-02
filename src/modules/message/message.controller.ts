import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthUser } from '../../decorators/auth-user.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { UserEntity } from '../user/user.entity';
import { CreateMessageDto } from './dto/CreateMessageDto';
import { MessageDto } from './dto/MessageDto';
import { DeleteMessageDto } from './dto/DeleteMessageDto';
import { UpdateMessageDto } from './dto/UpdateMessageDto';
import { MessageInfoDto } from './dto/MessageInfoDto';
import { MessageEntity } from './message.entity';
import { MessageService } from './message.service';

@Controller('message')
@ApiTags('message')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class MessageController {
    constructor(public readonly messageService: MessageService) {}

    @Get(':boardId')
    @ApiOkResponse({
        type: MessageInfoDto,
        description: 'get message',
    })
    async find(
        @AuthUser() user: UserEntity,
        @Param('boardId') boardId: string,
    ): Promise<MessageInfoDto[]> {
        await this.messageService.checkPermission(user.id, boardId);
        return this.messageService.find(boardId);
    }

    @Post('')
    @ApiOkResponse({
        type: CreateMessageDto,
        description: 'create message',
    })
    async create(
        @AuthUser() user: UserEntity,
        @Body() createMessageDto: CreateMessageDto,
    ): Promise<MessageDto> {
        return this.messageService.create(user.id, createMessageDto);
    }

    @Put(':id')
    @ApiOkResponse({
        type: UpdateMessageDto,
        description: 'update message',
    })
    async update(
        @AuthUser() user: UserEntity,
        @Param('id') id: string,
        @Body() updateMessageDto: UpdateMessageDto,
    ): Promise<UpdateMessageDto> {
        return this.messageService.update(user.id, id, updateMessageDto);
    }

    @Delete(':id')
    @ApiOkResponse({
        type: MessageDto,
        description: 'delete message',
    })
    async delete(
        @AuthUser() user: UserEntity,
        @Param('id') id: string,
    ): Promise<void> {
        await this.messageService.delete(id);
    }
}
