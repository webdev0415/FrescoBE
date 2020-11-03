/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable no-self-assign */
import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { PermissionEnum } from '../../common/constants/permission';
import { InvitationNotValidException } from '../../exceptions/invitaion-not-found.exception';
import { AuthService } from '../../modules/auth/auth.service';
import { LoginPayloadDto } from '../../modules/auth/dto/LoginPayloadDto';
import { MailService } from '../../modules/mail/mail.service';
import { UserToOrgEntity } from '../../modules/user-org/user-org.entity';
import { UserToOrgRepository } from '../user-org/user-org.repository';
import { InvitationDto } from './dto/InvitationDto';
import { SendInvitationDto } from './dto/SendInvitationDto';
import { VerifyTokenDto } from './dto/VerifyTokenDto';
import { InvitationEntity } from './invitation.entity';
import { InvitationRepository } from './invitation.repository';

@Injectable()
export class InvitationService {
    constructor(
        public readonly invitationRepository: InvitationRepository,
        public readonly userToOrgRepository: UserToOrgRepository,
        public readonly authService: AuthService,

        public readonly mailService: MailService, // public readonly userToOrgRepository: UserToOrgRepository
    ) {}

    async checkPermission(fromUserId: string, orgId: string): Promise<boolean> {
        // To do : check what is the permission in userToOrg
        const userOrg = await this.userToOrgRepository.findOne({
            where: {
                orgId,
                userId: fromUserId,
            },
        });
        if (userOrg && userOrg.permission === PermissionEnum.ADMIN) {
            return true;
        }
        return false;
    }

    // eslint-disable-next-line complexity
    async create(
        fromUserId: string,
        invitationDto: SendInvitationDto,
    ): Promise<InvitationEntity> {
        const isValid = await this.checkPermission(
            fromUserId,
            invitationDto.orgId,
        );

        if (!isValid) {
            throw new UnauthorizedException();
        }

        const isExisted = await this.invitationRepository.find({
            where: {
                orgId: invitationDto.orgId,
                toEmail: invitationDto.toEmail,
            },
        });

        if (isExisted && isExisted.length > 0) {
            throw new ConflictException();
        }

        const invitationModel = new InvitationEntity();
        invitationModel.orgId = invitationDto.orgId;
        invitationModel.fromUserId = fromUserId;
        invitationModel.toUserId = invitationDto.toUserId;
        invitationModel.toEmail = invitationDto.toEmail;
        invitationModel.permission = invitationDto.permission;
        invitationModel.token = invitationDto.token;
        invitationModel.verified = false;

        const invitation = await this.invitationRepository.save(
            invitationModel,
        );

        const invitationOrg = await this.invitationRepository.findOne(
            {
                orgId: invitationModel.orgId,
            },
            {
                relations: ['organization', 'userInvite'],
            },
        );

        // send mail
        await this.mailService.sendInvitationEmail(
            {
                email: invitationOrg.toEmail,
                organizationName: invitationOrg.organization?.name,
            },
            invitationDto.token,
        );
        return invitation;
    }

    async resendInvitation(
        id: string,
        invitationDto: InvitationDto,
    ): Promise<InvitationEntity> {
        const invitation = await this.invitationRepository.findOne({
            where: {
                id,
                token: invitationDto.token,
                verified: false,
            },
        });

        invitation.orgId = invitation.orgId;
        invitation.fromUserId = invitation.fromUserId;
        invitation.toEmail = invitation.toEmail;
        invitation.permission = invitation.permission;
        invitation.token = invitation.token;
        invitation.verified = false;

        await this.invitationRepository.save(invitation);

        const invitationOrg = await this.invitationRepository.findOne(
            {
                orgId: invitation.orgId,
            },
            {
                relations: ['organization', 'userInvite'],
            },
        );

        // send mail
        await this.mailService.sendInvitationEmail(
            {
                email: invitationOrg.toEmail,
                organizationName: invitationOrg.organization?.name,
            },
            invitationDto.token,
        );
        return invitation;
    }

    async checkValidToken(token: string): Promise<InvitationEntity> {
        const invitation = await this.invitationRepository.findOne({
            where: {
                token,
                verified: false,
            },
            relations: ['userInvite'],
        });

        if (!invitation) {
            throw new InvitationNotValidException();
        }

        return invitation;
    }

    async updateToVerified(verifyTokenDto: VerifyTokenDto): Promise<void> {
        await this.invitationRepository.update(verifyTokenDto.id, {
            verified: true,
            toUserId: verifyTokenDto.userId,
        });

        // create userToOrg
        const userToOrgModel = new UserToOrgEntity();
        userToOrgModel.orgId = verifyTokenDto.orgId;
        userToOrgModel.userId = verifyTokenDto.userId;
        userToOrgModel.permission = verifyTokenDto.permission;
        await this.userToOrgRepository.save(userToOrgModel);
    }

    async verify(verifyTokenDto: VerifyTokenDto): Promise<LoginPayloadDto> {
        const invitation = await this.checkValidToken(verifyTokenDto.token);
        verifyTokenDto.id = invitation.id;
        await this.updateToVerified(verifyTokenDto);

        const token = await this.authService.createToken({
            id: verifyTokenDto.userId,
        });

        return new LoginPayloadDto(invitation.userInvite.toDto(), token);
    }
}
