import { Test } from '@nestjs/testing';
import {
    SENDGRID_TOKEN,
    SendGridModule,
    SendGridModuleOptions,
    SendGridService,
} from '@ntegral/nestjs-sendgrid';

import { RoleType } from '../../../common/constants/role-type';
import { ConfigService } from '../../../shared/services/config.service';
import { UserDto } from '../../user/dto/UserDto';
import { MailService } from '../mail.service';

const mockUser: UserDto = {
    id: '1',
    email: 'test@gmail.com',
    name: 'test user',
    role: RoleType.USER,
};

describe('MailService', () => {
    let mailerService;
    let mailService;

    beforeEach(async () => {
        const config: SendGridModuleOptions = {
            apiKey: 'SG.123',
        };
        const module = await Test.createTestingModule({
            imports: [
                SendGridModule.forRootAsync({
                    useFactory: () => config,
                }),
            ],
            providers: [ConfigService, MailService],
        }).compile();

        mailService = module.get<MailService>(MailService);
        mailerService = module.get<SendGridService>(SENDGRID_TOKEN);
    });

    describe('sendConfirmationEmail', () => {
        it('sendConfirmationEmail success', () => {
            const mock = jest
                .spyOn(mailService, 'getEmailClient')
                .mockImplementationOnce(() => ({ send: jest.fn() }));

            const expectedResult: Promise<boolean> = Promise.resolve(true);
            const result = mailService.sendConfirmationEmail(mockUser);
            expect(result).toEqual(expectedResult);
            expect(mock).toHaveBeenCalled();
        });

        it('sendConfirmationEmail error', () => {
            const errorMessage = 'Sending email failed.';
            const mock = jest
                .spyOn(mailService, 'getEmailClient')
                .mockImplementationOnce(() => ({
                    send: jest.fn().mockReturnValue(new Error(errorMessage)),
                }));

            try {
                mailService.sendConfirmationEmail(mockUser);
            } catch (err) {
                expect(err.message).toEqual(errorMessage);
            }
            expect(mock).toHaveBeenCalled();
        });
    });
});
