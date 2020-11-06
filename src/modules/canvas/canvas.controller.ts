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

import { AuthUser } from '../../decorators/auth-user.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { UserEntity } from '../user/user.entity';
import { CanvasService } from './canvas.service';
import { CanvasDto } from './dto/CanvasDto';
import { CreateCanvasDto } from './dto/CreateCanvasDto';
import { DeleteCanvasDto } from './dto/DeleteCanvasDto';
import { UpdateCanvasDto } from './dto/UpdateCanvasDto';

@Controller('canvas')
@ApiTags('canvas')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class CanvasController {
    constructor(public readonly canvasService: CanvasService) {}

    @Get(':orgId/organization')
    @ApiOkResponse({
        type: CanvasDto,
        description: 'get list canvas by orgId',
    })
    async get(@Param('orgId') orgId: string): Promise<CanvasDto[]> {
        const canvases = await this.canvasService.get(orgId);
        return canvases.map((item) => item.toDto());
    }

    @Post('')
    @ApiOkResponse({
        type: CanvasDto,
        description: 'create canvas',
    })
    async create(
        @AuthUser() user: UserEntity,
        @Body() createCanvasDto: CreateCanvasDto,
    ): Promise<CanvasDto> {
        const canvas = await this.canvasService.create(
            user.id,
            createCanvasDto,
        );
        return canvas.toDto();
    }

    @Put(':id')
    @ApiOkResponse({
        type: CanvasDto,
        description: 'update canvas',
    })
    async update(
        @AuthUser() user: UserEntity,
        @Param('id') id: string,
        @Body() updateCanvasDto: UpdateCanvasDto,
    ): Promise<CanvasDto> {
        updateCanvasDto.id = id;
        const canvas = await this.canvasService.update(
            user.id,
            updateCanvasDto,
        );
        return canvas.toDto();
    }

    @Delete('')
    @ApiOkResponse({
        type: CanvasDto,
        description: 'delete canvas',
    })
    async delete(
        @AuthUser() user: UserEntity,
        @Body() deleteCanvasDto: DeleteCanvasDto,
    ): Promise<void> {
        const userId = user.id;
        await this.canvasService.delete(userId, deleteCanvasDto);
    }
}
