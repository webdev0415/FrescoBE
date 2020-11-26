/* eslint-disable @typescript-eslint/no-unused-vars */
import {CACHE_MANAGER, CacheModule, ConflictException, NotFoundException, UnauthorizedException,} from '@nestjs/common';
import {Test} from '@nestjs/testing';

import {RoleType} from '../../../common/constants/role-type';
import {ConfigService} from '../../../shared/services/config.service';
import {MailService} from '../../mail/mail.service';
import {UserDto} from '../../user/dto/UserDto';
import {UserEntity} from '../../user/user.entity';
import {UserService} from '../../user/user.service';
import {AuthController} from '../auth.controller';
import {AuthService} from '../auth.service';
import {LoginPayloadDto} from '../dto/LoginPayloadDto';
import {TokenPayloadDto} from '../dto/TokenPayloadDto';
import {UserRegisterDto} from '../dto/UserRegisterDto';
import {InvitationService} from "../../invitation/invitation.service";
import {mockInvitationService} from "../../__test__/base.service.specs";

const mockUserService = () => ({
    checkIfExists: jest.fn(),
    createUser: jest.fn(),
    confirmEmail: jest.fn(),
});
const mockAuthService = () => ({
    validateUser: jest.fn(),
    createToken: jest.fn(),
});
const mockMailService = () => ({
    sendConfirmationEmail: jest.fn(),
});
const mockCache = () => ({});
export const userEntity: UserEntity = {
    id: '1',
    name: 'example',
    role: RoleType.USER,
    email: 'example@fresco.com',
    password: '123',
    verified: true,
    googleId: null,
    createdAt: new Date(),
    dtoClass: UserDto,
    toDto: () => '',
};

describe('AuthController', () => {
    let authController: AuthController;
    let configService: ConfigService;
    let userService;
    let authService;
    let mailService;
    let host: string;
    let port: string;
    let cacheManager;
    let clientUrl: string;


    beforeEach(async () => {
        const module = await Test.createTestingModule({
            // controllers: [AuthController],
            imports: [CacheModule.register({ ttl: 10000 })],
            providers: [
                AuthController,
                ConfigService,
                { provide: UserService, useFactory: mockUserService },
                { provide: AuthService, useFactory: mockAuthService },
                { provide: MailService, useFactory: mockMailService },
                { provide: InvitationService, useFactory: mockInvitationService },
                // { provide: Cache, useFactory: mockCache },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        configService = module.get<ConfigService>(ConfigService);
        userService = module.get<UserService>(UserService);
        authService = module.get<AuthService>(AuthService);
        mailService = module.get<MailService>(MailService);
        cacheManager = module.get<any>(CACHE_MANAGER);
        clientUrl = configService.get('CLIENT_URL');
    });

    describe('manager should be available', () => {
        it('cache manager should be available', () => {
            expect(cacheManager).toBeDefined();
        });
    });

    describe('userLogin', () => {
        const token: TokenPayloadDto = {
            expiresIn: 1111,
            accessToken: 'kvjhlndlfkj',
        };

        const expectedResult: LoginPayloadDto = {
            token,
            user: userEntity.toDto(),
        };
        it('userLogin success', async () => {
            authService.validateUser.mockResolvedValue(userEntity);
            authService.createToken.mockResolvedValue(token);
            const result = await authController.userLogin(userEntity);
            expect(result).toEqual(expectedResult);
        });
        it('userLogin error', async () => {
            authService.validateUser.mockResolvedValue({
                ...userEntity,
                verified: false,
            } as any);
            authService.createToken.mockResolvedValue(token);
            const error = new UnauthorizedException();
            await expect(authController.userLogin(userEntity)).rejects.toThrow(
                error,
            );
        });
    });

    describe('googleAuthRedirect', () => {
        it('cache manager should be available', () => {
            expect(cacheManager).toBeDefined();
        });
        it('redirect to welcome page', () => {
            const user: TokenPayloadDto = {
                accessToken: 'JWT Token',
                expiresIn: 123123,
            };
            const req = {
                user,
            };
            const res = {
                redirect: jest.fn(),
            };

            const url = `${clientUrl}/auth/welcome-page?accessToken=${user.accessToken}&expiresIn=${user.expiresIn}`;

            authController.googleAuthRedirect(req, res);
            expect(res.redirect).toHaveBeenCalled();
            expect(res.redirect).toHaveBeenLastCalledWith(url);
        });

        it('redirect to login page', () => {
            const req = {
                user: null,
            };
            const res = {
                redirect: jest.fn(),
            };
            const url = `${clientUrl}/auth/login`;

            authController.googleAuthRedirect(req, res);
            expect(res.redirect).toHaveBeenCalled();
            expect(res.redirect).toHaveBeenLastCalledWith(url);
        });
    });

    describe('userRegister', () => {
        const userRegisterDto: UserRegisterDto = {

            email: 'example@fresco.com',
            password: '123',
        };

        it('userRegister success', async () => {
            const expectedResult: UserDto = userEntity.toDto();
            userService.checkIfExists.mockResolvedValue(false);
            userService.createUser.mockResolvedValue(userEntity);
            const result = await authController.userRegister(userEntity);
            expect(result).toEqual(expectedResult);
        });
        it('userRegister error', async () => {
            userService.checkIfExists.mockResolvedValue(true);
            userService.createUser.mockResolvedValue(userEntity);
            const error = new ConflictException();
            await expect(
                authController.userRegister(userEntity),
            ).rejects.toThrow(error);
        });
    });
    describe('confirmEmail', () => {
        it('confirmEmail success', async () => {
            const expectedResult: UserDto = userEntity.toDto();
            const code = '2321';
            cacheManager.get = jest.fn();
            cacheManager.get.mockResolvedValue('1');
            userService.confirmEmail.mockReturnValue(userEntity.toDto());
            const result = await authController.confirmEmail(code);
            expect(result).toEqual(expectedResult);
        });
        it('confirmEmail error', () => {
            const code = '2321';
            cacheManager.get = jest.fn();
            cacheManager.get.mockResolvedValue('');
            const error = new NotFoundException();
            void expect(authController.confirmEmail(code)).rejects.toThrow(
                error,
            );
        });
    });
    describe('me (getCurrentUser)', () => {
        it('me (getCurrentUser) success', () => {
            expect(authController.getCurrentUser(userEntity)).toEqual(
                userEntity.toDto(),
            );
        });
    });
});
