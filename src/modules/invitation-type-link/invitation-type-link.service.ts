import { Injectable, NotFoundException } from '@nestjs/common';

import { InvitationType } from '../../common/constants/invitation-type';
import { InvitationAcceptedException } from '../../exceptions/accepted-invitation';
import { InvitationLimitedException } from '../../exceptions/invitation-limited';
import { BoardUserOrgEntity } from '../../modules/board-user-org/board-user-org.entity';
import { BoardUserOrgRepository } from '../../modules/board-user-org/board-user-org.repository';
import { BoardRepository } from '../../modules/board/board.repository';
import { CanvasUserOrgEntity } from '../../modules/canvas-user-org/canvas-user-org.entity';
import { CanvasUserOrgRepository } from '../../modules/canvas-user-org/canvas-user-org.repository';
import { CanvasRepository } from '../../modules/canvas/canvas.repository';
import { CanvasService } from '../../modules/canvas/canvas.service';
import { InvitationTypeLinkUserService } from '../../modules/invitation-type-link-user/invitation-type-link-user.service';
import { OrganizationRepository } from '../../modules/organization/organization.repository';
import { ConfigService } from '../../shared/services/config.service';
import { CreateInvitationTypeLinkDto } from './dto/CreateInvitationTypeLinkDto';
import { DeleteInvitationTypeLinkDto } from './dto/DeleteInvitationTypeLinkDto';
import { HandleRequestInvitationLinkDto } from './dto/HandleRequestInvitationLinkDto';
import { InvitationTypeLinkDto } from './dto/InvitationTypeLinkDto';
import { InvitationTypeLinkInfoDto } from './dto/InvitationTypeLinkInfoDto';
import { InvitationTypeLinkEntity } from './invitation-type-link.entity';
import { InvitationTypeLinkRepository } from './invitation-type-link.repository';

@Injectable()
export class InvitationTypeLinkService {
    constructor(
        public readonly invitationTypeLinkRepository: InvitationTypeLinkRepository,
        public readonly canvasService: CanvasService,
        public readonly organizationRepository: OrganizationRepository,
        public readonly canvasRepository: CanvasRepository,
        public readonly boardRepository: BoardRepository,
        public readonly configService: ConfigService,
        public readonly invitationTypeLinkUserService: InvitationTypeLinkUserService,
        public readonly boardUserOrgRepository: BoardUserOrgRepository,
        public readonly canvasUserOrgRepository: CanvasUserOrgRepository,
    ) {}

    // eslint-disable-next-line complexity
    async create(
        userId: string,
        createInvitationTypeLinkDto: CreateInvitationTypeLinkDto,
    ): Promise<InvitationTypeLinkEntity> {
        const org = await this.organizationRepository.findOne({
            where: {
                id: createInvitationTypeLinkDto.orgId,
            },
        });
        if (!org) {
            throw new NotFoundException('orgId is not valid');
        }
        await this.canvasService.isAdminOrEditor(
            userId,
            createInvitationTypeLinkDto.orgId,
        );

        let typeData;
        if (createInvitationTypeLinkDto.type === InvitationType.CANVAS) {
            typeData = await this.canvasRepository.findOne({
                where: {
                    id: createInvitationTypeLinkDto.typeId,
                },
            });
        } else {
            typeData = await this.boardRepository.findOne({
                where: {
                    id: createInvitationTypeLinkDto.typeId,
                },
            });
        }

        if (!typeData) {
            throw new NotFoundException('typeId is not valid');
        }

        const invitationTypeLinkModel = new InvitationTypeLinkEntity();
        invitationTypeLinkModel.token = createInvitationTypeLinkDto.token;
        invitationTypeLinkModel.createdUserId = userId;
        invitationTypeLinkModel.orgId = createInvitationTypeLinkDto.orgId;
        invitationTypeLinkModel.numberOfUser = 0;
        invitationTypeLinkModel.type = createInvitationTypeLinkDto.type;
        invitationTypeLinkModel.permission =
            createInvitationTypeLinkDto.permission;
        invitationTypeLinkModel.typeId = createInvitationTypeLinkDto.typeId;
        invitationTypeLinkModel.isDeleted = false;

        return this.invitationTypeLinkRepository.save(invitationTypeLinkModel);
    }

    // eslint-disable-next-line complexity
    async handleRequest(
        userId: string,
        handleRequestInvitationLinkDto: HandleRequestInvitationLinkDto,
    ): Promise<InvitationTypeLinkEntity> {
        const invitationTypeLink = await this.invitationTypeLinkRepository.findOne(
            {
                where: {
                    token: handleRequestInvitationLinkDto.token,
                },
            },
        );
        if (!invitationTypeLink) {
            throw new NotFoundException('token is not valid');
        }

        const invitationTypeLinkUser = await this.invitationTypeLinkUserService.getInvitationTypeLinkUser(
            invitationTypeLink.id,
            userId,
        );
        if (invitationTypeLinkUser) {
            throw new InvitationAcceptedException(
                'You accepted this invitation',
            );
        }

        // compare number of user
        const numberOfUser = this.configService.getNumber('NUMBER_OF_USER');
        if (invitationTypeLink.numberOfUser >= numberOfUser) {
            throw new InvitationLimitedException('Invitation is limited');
        }

        // create invitationTypeLinkUserService
        await this.invitationTypeLinkUserService.create({
            userId,
            invitationTypeLinkId: invitationTypeLink.id,
        });
        // update numberOfUser
        invitationTypeLink.numberOfUser += 1;
        const invitationTypeLinkUpdated = await this.invitationTypeLinkRepository.save(
            invitationTypeLink,
        );

        // create ${type}_user_org record
        if (invitationTypeLink.type === InvitationType.CANVAS) {
            const canvasUserOrgModel = new CanvasUserOrgEntity();
            canvasUserOrgModel.canvasId = invitationTypeLink.typeId;
            canvasUserOrgModel.orgId = invitationTypeLink.orgId;
            canvasUserOrgModel.permission = invitationTypeLink.permission;
            canvasUserOrgModel.userId = userId;
            await this.canvasUserOrgRepository.save(canvasUserOrgModel);
        } else {
            const boardUserOrgModel = new BoardUserOrgEntity();
            boardUserOrgModel.boardId = invitationTypeLink.typeId;
            boardUserOrgModel.orgId = invitationTypeLink.orgId;
            boardUserOrgModel.userId = userId;
            boardUserOrgModel.permission = invitationTypeLink.permission;
            await this.boardUserOrgRepository.save(boardUserOrgModel);
        }

        return invitationTypeLinkUpdated;
    }

    async getInvitationTypeLinkByTypeAndOrgId(
        userId: string,
        invitationTypeLinkEntity: InvitationTypeLinkEntity,
    ): Promise<InvitationTypeLinkInfoDto[]> {
        const listInvitationTypeLink = [];
        const invitationTypeLink = await this.invitationTypeLinkRepository.find(
            {
                where: {
                    type: invitationTypeLinkEntity.type,
                    orgId: invitationTypeLinkEntity.orgId,
                    typeId: invitationTypeLinkEntity.typeId,
                    createdUserId: userId,
                    isDeleted: 0,
                },
            },
        );
        if (!invitationTypeLink) {
            throw new NotFoundException();
        }
        for (const item of invitationTypeLink) {
            const organization = await this.organizationRepository.findOne({
                where: {
                    id: item.orgId,
                },
            });
            const board = await this.boardRepository.findOne({
                where: {
                    id: item.typeId,
                },
            });

            const invitationTypeLinkInfoDto = item.toDto() as InvitationTypeLinkInfoDto;
            invitationTypeLinkInfoDto.board = board?.toDto() || null;
            invitationTypeLinkInfoDto.organization =
                organization?.toDto() || null;
            listInvitationTypeLink.push(invitationTypeLinkInfoDto);
        }
        return listInvitationTypeLink;
    }

    async delete({
        invitationTypeLinkId,
        createdUserId,
    }: DeleteInvitationTypeLinkDto): Promise<InvitationTypeLinkDto> {
        const invitationTypeLink = await this.invitationTypeLinkRepository.findOne(
            {
                where: {
                    id: invitationTypeLinkId,
                    createdUserId,
                    isDeleted: 0,
                },
            },
        );
        if (!invitationTypeLink) {
            throw new NotFoundException();
        }
        invitationTypeLink.isDeleted = true;
        const invitationTypeLinkDeleted = await this.invitationTypeLinkRepository.save(
            invitationTypeLink,
        );
        return invitationTypeLinkDeleted.toDto() as InvitationTypeLinkDto;
    }
}
