/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable no-self-assign */
import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { BoardUserOrgRepository } from '../../modules/board-user-org/board-user-org.repository';
import { InvitationType } from '../../common/constants/invitation-type';

import { PermissionEnum } from '../../common/constants/permission';
import { InvitationNotValidException } from '../../exceptions/invitaion-not-found.exception';
import { AuthService } from '../../modules/auth/auth.service';
import { LoginPayloadDto } from '../../modules/auth/dto/LoginPayloadDto';
import { MailService } from '../../modules/mail/mail.service';
import { UserToOrgEntity } from '../../modules/user-org/user-org.entity';
import { UserToOrgRepository } from '../user-org/user-org.repository';
import { InvitationDto } from './dto/InvitationDto';
import { InVitationTypeEmailDto } from './dto/InvitationTypeEmailDto';
import { SendInvitationDto } from './dto/SendInvitationDto';
import { VerifyTokenDto } from './dto/VerifyTokenDto';
import { InvitationEntity } from './invitation.entity';
import { InvitationRepository } from './invitation.repository';
import { CanvasUserOrgRepository } from '../../modules/canvas-user-org/canvas-user-org.repository';
import { CanvasUserOrgEntity } from '../../modules/canvas-user-org/canvas-user-org.entity';
import { BoardUserOrgEntity } from '../../modules/board-user-org/board-user-org.entity';

@Injectable()
export class InvitationService {
    constructor(
        public readonly invitationRepository: InvitationRepository,
        public readonly userToOrgRepository: UserToOrgRepository,
        public readonly authService: AuthService,
        public readonly mailService: MailService, // public readonly userToOrgRepository: UserToOrgRepository
        public readonly boardUserOrgRepository: BoardUserOrgRepository,
        public readonly canvasUserOrgRepository: CanvasUserOrgRepository,
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

        const isExisted = await this.invitationRepository.findOne({
            where: {
                orgId: invitationDto.orgId,
                toEmail: invitationDto.toEmail,
                verified: false,
            },
        });

        if (isExisted) {
            await this.resendInvitation(isExisted.id);

            // throw new ConflictException();
            return isExisted;
        }

        let existingUser = await this.authService.getUserByEmail(
            invitationDto.toEmail,
        );

        const invitationModel = new InvitationEntity();
        invitationModel.orgId = invitationDto.orgId;
        invitationModel.fromUserId = fromUserId;
        invitationModel.toUserId = existingUser
            ? existingUser.id
            : invitationDto.toUserId;
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

    async resendInvitation(id: string): Promise<InvitationEntity> {
        const invitation = await this.invitationRepository.findOne({
            where: {
                id,
                verified: false,
            },
        });

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
                email: invitation.toEmail,
                organizationName: invitationOrg.organization?.name,
            },
            invitation.token,
        );
        return invitation;
    }

    async checkValidToken(token: string): Promise<InvitationEntity> {
        const invitation = await this.invitationRepository.findOne({
            where: {
                token,
                // verified: false,
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

    async invitationTypeEmails(
        
        listInVitationTypeEmailDto: InVitationTypeEmailDto[],
    ): Promise<void> {
        // const listInviteUsers = [];
        let condition = null;
        let repository = null;
        let model = null;
        listInVitationTypeEmailDto.forEach(async (item) => {
            const userOrg = await this.userToOrgRepository.findOne({
                where: {
                    orgId: item.orgId,
                    userId: item.toUserId,
                },
            });
            console.log('1111111111111', userOrg)

            if (!userOrg) {
                const userToOrgModel = new UserToOrgEntity();
                userToOrgModel.orgId = item.orgId;
                userToOrgModel.userId = item.toUserId;
                userToOrgModel.permission = item.permission;
                await this.userToOrgRepository.save(userToOrgModel);
                console.log('222222222222222', userToOrgModel)
            }

            if (item.type === InvitationType.CANVAS) {
                repository = this.canvasUserOrgRepository;
                condition = `${item.type}_user_org.canvasId = :typeId`;
                model = new CanvasUserOrgEntity();
                model.canvasId = item.typeId;
                model.orgId = item.orgId;
                model.permission = item.permission;
                model.userId = item.toUserId;
                console.log('3333333333333333', model, condition)
            } else {
                repository = this.boardUserOrgRepository;
                condition = `${item.type}_user_org.boardId = :typeId`;
                model = new BoardUserOrgEntity();
                model.boardId = item.typeId;
                model.orgId = item.orgId;
                model.userId = item.toUserId;
                model.permission = item.permission;
                console.log('444444444444444', model, condition)
            }

            const type = await repository
                .createQueryBuilder(`${item.type}_user_org`)
                .where(condition, { typeId: item.typeId })
                .andWhere(`${item.type}_user_org.orgId = :orgId`, {
                    orgId: item.orgId,
                })
                .andWhere(`${item.type}_user_org.userId = :userId`, {
                    userId: item.toUserId,
                })
                .getOne();

                console.log('555555555555555', type)
            if (type) {
                console.log('66666666666666666666', type)
                return;
            }

            await repository.save(model);
            console.log('77777777777777777777', type)
            if (item.notify) {
                // send mail
            }
        });
    }
}
