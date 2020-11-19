import { Injectable, NotFoundException } from '@nestjs/common';

import { InvitationType } from '../../common/constants/invitation-type';
import { BoardRepository } from '../../modules/board/board.repository';
import { CanvasRepository } from '../../modules/canvas/canvas.repository';
import { CanvasService } from '../../modules/canvas/canvas.service';
import { OrganizationRepository } from '../../modules/organization/organization.repository';
import { CreateInvitationTypeLinkDto } from './dto/CreateInvitationTypeLinkDto';
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
        invitationTypeLinkModel.numberOfUser =
            createInvitationTypeLinkDto.numberOfUser;
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
        const invitationTypeLinkModel = new InvitationTypeLinkEntity();
        invitationTypeLinkModel.token = createInvitationTypeLinkDto.token;
        invitationTypeLinkModel.createdUserId = userId;
        invitationTypeLinkModel.orgId = createInvitationTypeLinkDto.orgId;
        invitationTypeLinkModel.numberOfUser =
            createInvitationTypeLinkDto.numberOfUser;
        invitationTypeLinkModel.type = createInvitationTypeLinkDto.type;
        invitationTypeLinkModel.permission =
            createInvitationTypeLinkDto.permission;
        invitationTypeLinkModel.typeId =
            createInvitationTypeLinkDto.typeId || '';
        invitationTypeLinkModel.isDeleted = false;

        return this.invitationTypeLinkRepository.save(invitationTypeLinkModel);
    }
}
