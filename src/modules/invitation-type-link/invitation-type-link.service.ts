import { Injectable } from '@nestjs/common';

import { CanvasService } from '../../modules/canvas/canvas.service';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { CanvasRepository } from '../canvas/canvas.repository';
import { CreateInvitationTypeLinkDto } from './dto/CreateInvitationTypeLinkDto';
import { InvitationTypeLinkEntity } from './invitation-type-link.entity';
import { InvitationTypeLinkRepository } from './invitation-type-link.repository';

@Injectable()
export class InvitationTypeLinkService {
    constructor(
        public readonly invitationTypeLinkRepository: InvitationTypeLinkRepository,
        public readonly canvasRepository: CanvasRepository,
        public readonly validatorService: ValidatorService,
        public readonly awsS3Service: AwsS3Service,
        public readonly canvasService: CanvasService,
    ) {}

    // eslint-disable-next-line complexity
    async create(
        userId: string,
        createInvitationTypeLinkDto: CreateInvitationTypeLinkDto,
    ): Promise<InvitationTypeLinkEntity> {
        await this.canvasService.isAdminOrEditor(
            userId,
            createInvitationTypeLinkDto.orgId,
        );
        const invitationTypeLinkModel = new InvitationTypeLinkEntity();
        invitationTypeLinkModel.token = createInvitationTypeLinkDto.token;
        invitationTypeLinkModel.createUserId = userId;
        invitationTypeLinkModel.orgId = createInvitationTypeLinkDto.orgId;
        invitationTypeLinkModel.numberOfUsers =
            createInvitationTypeLinkDto.numberOfUsers;
        invitationTypeLinkModel.type = createInvitationTypeLinkDto.type;
        invitationTypeLinkModel.permission =
            createInvitationTypeLinkDto.permission;

        return this.invitationTypeLinkRepository.save(invitationTypeLinkModel);
    }
}
