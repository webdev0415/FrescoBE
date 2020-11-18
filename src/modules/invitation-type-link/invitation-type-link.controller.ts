/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
    Body,
    Controller,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthUser } from '../../decorators/auth-user.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { UserEntity } from '../../modules/user/user.entity';
import { CreateInvitationTypeLinkDto } from './dto/CreateInvitationTypeLinkDto';
import { InvitationTypeLinkDto } from './dto/InvitationTypeLinkDto';
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
        @Body() createInvitationTypeLinkDto: CreateInvitationTypeLinkDto,
    ): Promise<CreateInvitationTypeLinkDto> {
        const invitationTypeLink = await this.invitationTypeLinkService.handleRequest(
            user.id,
            createInvitationTypeLinkDto,
        );
        return invitationTypeLink.toDto();
    }
}
