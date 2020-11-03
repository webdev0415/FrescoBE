import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { SendEmailInvitationDto } from '../../modules/invitation/dto/SendEmailInvitationDto';

import { ConfigService } from '../../shared/services/config.service';
import { UserDto } from '../user/dto/UserDto';

@Injectable()
export class MailService {
    private readonly _logger = new Logger(MailService.name);

    constructor(
        private readonly _mailerService: MailerService,
        public readonly configService: ConfigService,
    ) {}

    /** Send email confirmation link to new user account. */
    async sendConfirmationEmail(user: UserDto, code: string): Promise<boolean> {
        try {
            // TODO: remove host and port from the env and make only a single domain
            const clientUrl = this.configService.get('CLIENT_URL');
            const url = `${clientUrl}/auth/email-confirmation/${code}`;
            const result = await this._mailerService.sendMail({
                template: 'confirmation',
                context: {
                    url,
                    user,
                },
                subject: 'Welcome to Fresco! Please Confirm Your Email Address',
                to: user.email,
            });
            // eslint-disable-next-line @typescript-eslint/tslint/config
            return result;
        } catch (error) {
            this._logger.error(
                `Failed to send confirmation email to '${user.email}'`,
                error.stack,
            );
            throw error;
        }
    }

    async sendInvitationEmail(organization: SendEmailInvitationDto, code: string): Promise<boolean> {
        try {
            const clientUrl = this.configService.get('CLIENT_URL');
            const url = `${clientUrl}/invite/${code}`;
            const result = await this._mailerService.sendMail({
                template: 'invitation',
                context: {
                    url,
                    organization: organization.organizationName,
                },
                subject: 'Fresco invitation',
                to: organization.email,
            });
            // eslint-disable-next-line @typescript-eslint/tslint/config
            return result;
        } catch (error) {
            this._logger.error(
                `Failed to send confirmation email to '${organization.email}'`,
                error.stack,
            );
            throw error;
        }
    }
}
