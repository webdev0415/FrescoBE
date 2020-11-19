import { Injectable, NotFoundException } from '@nestjs/common';

import { CanvasService } from '../../modules/canvas/canvas.service';
import { OrganizationRepository } from '../../modules/organization/organization.repository';
import { CreateInvitationTypeLinkDto } from './dto/CreateInvitationTypeLinkDto';
import { InvitationTypeLinkEntity } from './invitation-type-link.entity';
import { InvitationTypeLinkRepository } from './invitation-type-link.repository';
import {InvitationTypeLinkInfoDto} from "./dto/InvitationTypeLinkInfoDto";
import {BoardRepository} from "../board/board.repository";
import {DeleteInvitationTypeLinkDto} from "./dto/DeleteInvitationTypeLinkDto";
import {InvitationTypeLinkDto} from "./dto/InvitationTypeLinkDto";

@Injectable()
export class InvitationTypeLinkService {
    constructor(
        public readonly invitationTypeLinkRepository: InvitationTypeLinkRepository,
        public readonly canvasService: CanvasService,
        public readonly organizationRepository: OrganizationRepository,
        public readonly boardRepository: BoardRepository
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

    async getInvitationTypeLinkByTypeAndOrgId(userId: string, invitationTypeLinkEntity: InvitationTypeLinkEntity): Promise<InvitationTypeLinkInfoDto[]>{
        const listInvitationTypeLink = [];
        const invitationTypeLink = await this.invitationTypeLinkRepository.find({
            where: {
                type: invitationTypeLinkEntity.type,
                orgId: invitationTypeLinkEntity.orgId,
                typeId: invitationTypeLinkEntity.typeId,
                createdUserId: userId,
                isDeleted: 0
            }
        });
        if(!invitationTypeLink){
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
            invitationTypeLinkInfoDto.organization = organization?.toDto() || null;
            listInvitationTypeLink.push(invitationTypeLinkInfoDto);
        }
        return listInvitationTypeLink;
    }

    async delete({ invitationTypeLinkId, createdUserId }: DeleteInvitationTypeLinkDto):Promise<InvitationTypeLinkDto>{
        const invitationTypeLink = await this.invitationTypeLinkRepository.findOne({
            where: {
                id: invitationTypeLinkId,
                createdUserId: createdUserId,
                isDeleted: 0
            }
        });
        if (!invitationTypeLink) {
            throw new NotFoundException();
        }
        invitationTypeLink.isDeleted = true;
        const invitationTypeLinkDeleted = await this.invitationTypeLinkRepository.save(invitationTypeLink);
        return invitationTypeLinkDeleted.toDto() as InvitationTypeLinkDto;
    }
}
