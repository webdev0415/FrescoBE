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

import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { DefaultTemplateService } from './default-template.service';
import { CreateDefaultTemplateDto } from './dto/CreateDefaultTemplateDto';
import { DefaultTemplateDto } from './dto/DefaultTemplateDto';
import { DeleteDefaultTemplateDto } from './dto/DeleteDefaultTemplateDto';
import { UpdateDefaultTemplateDto } from './dto/UpdateDefaultTemplateDto';

@Controller('default-template')
@ApiTags('default-template')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class DefaultTemplateController {
    constructor(
        public readonly defaultTemplateService: DefaultTemplateService,
    ) {}

    @Get('')
    @ApiOkResponse({
        type: DefaultTemplateDto,
        description: 'get list default_template',
    })
    async get(): Promise<DefaultTemplateDto[]> {
        const defaultTemplate = await this.defaultTemplateService.get();
        return defaultTemplate.map((item) => item.toDto());
    }

    @Post('')
    @ApiOkResponse({
        type: DefaultTemplateDto,
        description: 'create default_template',
    })
    async create(
        @Body() createDefaultTemplateDto: CreateDefaultTemplateDto,
    ): Promise<DefaultTemplateDto> {
        const defaultTemplate = await this.defaultTemplateService.create(
            createDefaultTemplateDto,
        );
        return defaultTemplate.toDto();
    }

    @Put(':id')
    @ApiOkResponse({
        type: DefaultTemplateDto,
        description: 'update default_template',
    })
    async update(
        @Param('id') id: string,
        @Body() defaultTemplateDto: UpdateDefaultTemplateDto,
    ): Promise<DefaultTemplateDto> {
        defaultTemplateDto.id = id;
        const defaultTemplate = await this.defaultTemplateService.update(
            defaultTemplateDto,
        );
        return defaultTemplate.toDto();
    }

    @Delete(':id')
    @ApiOkResponse({
        type: DefaultTemplateDto,
        description: 'delete default_template',
    })
    async delete(
        @Body() deleteDefaultTemplateDto: DeleteDefaultTemplateDto,
        @Param('id') id: string,
    ): Promise<void> {
        deleteDefaultTemplateDto.defaultTemplateId = id;
        await this.defaultTemplateService.delete(deleteDefaultTemplateDto);
    }
}
