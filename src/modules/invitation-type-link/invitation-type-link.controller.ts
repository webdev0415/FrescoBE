/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { InvitationType } from '../../common/constants/invitation-type';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { UserEntity } from '../../modules/user/user.entity';
import { CreateInvitationTypeLinkDto } from './dto/CreateInvitationTypeLinkDto';
import { DeleteInvitationTypeLinkDto } from './dto/DeleteInvitationTypeLinkDto';
import { HandleRequestInvitationLinkDto } from './dto/HandleRequestInvitationLinkDto';
import { InvitationTypeLinkDto } from './dto/InvitationTypeLinkDto';
import { InvitationTypeLinkInfoDto } from './dto/InvitationTypeLinkInfoDto';
import { InvitationTypeLinkEntity } from './invitation-type-link.entity';
import { InvitationTypeLinkService } from './invitation-type-link.service';

@Controller('invitation-type')
@ApiTags('invitation-type')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class InvitationTypeLinkController {
    constructor(
        public readonly invitationTypeLinkService: InvitationTypeLinkService,
    ) {}

    @Post('')
    @ApiOkResponse({
        type: InvitationTypeLinkDto,
        description: 'create invitation type link',
    })
    async create(
        @AuthUser() user: UserEntity,
        @Body() createInvitationTypeLinkDto: CreateInvitationTypeLinkDto,
    ): Promise<CreateInvitationTypeLinkDto> {
        const invitationTypeLink = await this.invitationTypeLinkService.create(
            user.id,
            createInvitationTypeLinkDto,
        );
        return invitationTypeLink.toDto();
    }

    @Post('request')
    @ApiOkResponse({
        type: InvitationTypeLinkDto,
        description: 'handle request invitation type link',
    })
    async handleRequest(
        @AuthUser() user: UserEntity,
        @Body() handleRequestInvitationLinkDto: HandleRequestInvitationLinkDto,
    ): Promise<CreateInvitationTypeLinkDto> {
        const invitationTypeLink = await this.invitationTypeLinkService.handleRequest(
            user.id,
            handleRequestInvitationLinkDto,
        );
        return invitationTypeLink.toDto();
    }

    @Get(':type/:orgId/:typeId')
    @ApiOkResponse({
        type: InvitationTypeLinkInfoDto,
        description: 'get invitation type link by type and organization id',
    })
    async getInvitationTypeLinkByTypeAndOrgId(
        @AuthUser() user: UserEntity,
        @Param('type') type: InvitationType,
        @Param('orgId') orgId: string,
        @Param('typeId') typeId: string,
    ): Promise<InvitationTypeLinkInfoDto[]> {
        const invitationTypeLinkModel = new InvitationTypeLinkEntity();
        invitationTypeLinkModel.type = type;
        invitationTypeLinkModel.orgId = orgId;
        invitationTypeLinkModel.typeId = typeId;
        const invitationTypeLinkInfoDto = await this.invitationTypeLinkService.getInvitationTypeLinkByTypeAndOrgId(
            user.id,
            invitationTypeLinkModel,
        );
        return invitationTypeLinkInfoDto;
    }

    @Delete(':id')
    @ApiOkResponse({
        type: InvitationTypeLinkDto,
        description: 'delete invitation type link',
    })
    async delete(
        @AuthUser() user: UserEntity,
        @Body() deleteInvitationTypeLinkDto: DeleteInvitationTypeLinkDto,
        @Param('id') id: string,
    ): Promise<InvitationTypeLinkDto> {
        deleteInvitationTypeLinkDto.invitationTypeLinkId = id;
        deleteInvitationTypeLinkDto.createdUserId = user.id;
        const invitationTypeLinkInfoDto = await this.invitationTypeLinkService.delete(
            deleteInvitationTypeLinkDto,
        );
        return invitationTypeLinkInfoDto;
    }
}
