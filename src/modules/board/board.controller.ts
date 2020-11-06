/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
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
import { RolesGuard } from '../../guards/roles.guard';
import { UserEntity } from '../../modules/user/user.entity';

import { AuthUser } from '../../decorators/auth-user.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { BoardService } from './board.service';
import { BoardDto } from './dto/BoardDto';
import { DeleteBoardDto } from './dto/DeleteBoardDto';
import { CreateBoardDto } from './dto/CreateBoardDto';
import { UpdateBoardDto } from './dto/UpdateBoardDto';

@Controller('board')
@ApiTags('board')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class BoardController {
    constructor(public readonly boardService: BoardService) {}

    @Get(':orgId/organization')
    @ApiOkResponse({
        type: BoardDto,
        description: 'get list board by orgId',
    })
    async get(@Param('orgId') orgId: string): Promise<BoardDto[]> {
        const boards = await this.boardService.get(orgId);
        return boards.map((item) => item.toDto());
    }

    @Post('')
    @ApiOkResponse({
        type: BoardDto,
        description: 'create board',
    })
    async create(
        @AuthUser() user: UserEntity,
        @Body() createBoardDto: CreateBoardDto,
    ): Promise<BoardDto> {
        // console.log('user');
        // return null
        const board = await this.boardService.create(user.id, createBoardDto);
        return board.toDto();
    }

    @Put(':id')
    @ApiOkResponse({
        type: BoardDto,
        description: 'update board',
    })
    async update(
        @AuthUser() user: UserEntity,
        @Param('id') id: string,
        @Body() updateBoardDto: UpdateBoardDto,
    ): Promise<BoardDto> {
        updateBoardDto.id = id;
        const board = await this.boardService.update(user.id, updateBoardDto);
        return board.toDto();
    }

    @Delete(':id')
    @ApiOkResponse({
        type: BoardDto,
        description: 'delete board',
    })
    async delete(
        @AuthUser() user: UserEntity,
        @Body() deleteBoardDto: DeleteBoardDto,
        @Param('id') id: string,
    ): Promise<void> {
        deleteBoardDto.boardId = id;
        deleteBoardDto.userId = user.id;
        await this.boardService.delete(deleteBoardDto);
    }
}