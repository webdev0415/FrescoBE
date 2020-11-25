import {MailerService} from '@nestjs-modules/mailer';
import {Test} from '@nestjs/testing';

import {RoleType} from '../../../common/constants/role-type';
import {ConfigService} from '../../../shared/services/config.service';
import {UserDto} from '../../user/dto/UserDto';
import {MailService} from '../mail.service';

const mockUser: UserDto = {
    id: '1',
    email: 'test@gmail.com',
    name: 'test user',
    role: RoleType.USER,
};

const mockMailerService = () => ({
    sendMail: jest.fn(),
});

describe('MailService', () => {
    let mailerService;
    let mailService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ConfigService,
                MailService,
                { provide: MailerService, useFactory: mockMailerService },
            ],
        }).compile();

        mailService = module.get<MailService>(MailService);
        mailerService = module.get<MailerService>(MailerService);
    });

    describe('sendConfirmationEmail', () => {
        it('sendConfirmationEmail success', () => {
            const expectedResult: Promise<boolean> = Promise.resolve(true);
            mailerService.sendMail.mockResolvedValue(expectedResult);
            const result = mailService.sendConfirmationEmail(mockUser);
            expect(result).toEqual(expectedResult);
            expect(mailerService.sendMail).toBeCalled();
        });
        it('sendConfirmationEmail error', () => {
            const errorMessage = 'Sending email failed.';
            const error = new Error(errorMessage);
            mailerService.sendMail.mockRejectedValue(error);
            expect(mailService.sendConfirmationEmail(mockUser,"")).rejects.toThrow(
                errorMessage,
            );
        });
    });
});
