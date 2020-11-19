/* eslint-disable @typescript-eslint/tslint/config */
import { Injectable } from '@nestjs/common';

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
        const image = await this.invitationTypeLinkUserRepository.findOne({
            where: {
                invitationTypeLinkId,
                userId,
            },
        });
        return image;
    }
}
