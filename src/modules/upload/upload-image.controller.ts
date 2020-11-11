/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
    Body,
    Controller,
    Param,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { IFile } from '../../interfaces/IFile';
import { UploadImageDto } from './dto/UploadImageDto';
import { UploadImageService } from './upload-image.service';

@Controller('upload-image')
@ApiTags('upload-image')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class UploadImageController {
    constructor(public readonly defaultTemplateService: UploadImageService) {}

    @Post('/image/:type')
    @ApiOkResponse({
        type: UploadImageDto,
        description: 'create upload image',
    })
    async create(
        @Param('type') typeUpload: string,
        @Body() file: IFile,
    ): Promise<UploadImageDto> {
        const defaultTemplate = await this.defaultTemplateService.create(
            { type: typeUpload },
            file,
        );
        return defaultTemplate.toDto();
    }
}
