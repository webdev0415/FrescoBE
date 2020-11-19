/* eslint-disable @typescript-eslint/tslint/config */
import { Injectable } from '@nestjs/common';

import { CreateInvitationTypeLinkUserDto } from './dto/CreateInvitationTypeLinkUserDto';
import { InvitationTypeLinkUserDto } from './dto/InvitationTypeLinkUserDto';
import { InvitationTypeLinkUserEntity } from './invitation-type-link-user.entity';
import { InvitationTypeLinkUserRepository } from './invitation-type-link-user.repository';

@Injectable()
export class InvitationTypeLinkUserService {
    constructor(
        public readonly invitationTypeLinkUserRepository: InvitationTypeLinkUserRepository,
    ) {}

    async getInvitationTypeLinkUser(
        invitationTypeLinkId: string,
        userId: string,
    ): Promise<InvitationTypeLinkUserEntity> {
        const invitationTypeLinkUser = await this.invitationTypeLinkUserRepository.findOne(
            {
                where: {
                    invitationTypeLinkId,
                    userId,
                },
            },
        );
        return invitationTypeLinkUser;
    }

    async create(
        createCategoryDto: CreateInvitationTypeLinkUserDto,
    ): Promise<InvitationTypeLinkUserEntity> {
        const invitationTypeLinkUserModel = new InvitationTypeLinkUserEntity();
        invitationTypeLinkUserModel.userId = createCategoryDto.userId;
        invitationTypeLinkUserModel.invitationTypeLinkId =
            createCategoryDto.invitationTypeLinkId;

        const invitationTypeLinkUser = await this.invitationTypeLinkUserRepository.save(
            invitationTypeLinkUserModel,
        );

        return invitationTypeLinkUser;
    }
}
