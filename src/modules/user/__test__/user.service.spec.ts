import {NotFoundException} from '@nestjs/common';
import {Test} from '@nestjs/testing';

import {RoleType} from '../../../common/constants/role-type';
import {UserLoginGoogleDto} from '../../auth/dto/UserLoginGoogleDto';
import {UserRepository} from '../../user/user.repository';
import {UserDto} from '../dto/UserDto';
import {UserEntity} from '../user.entity';
import {UserService} from '../user.service';
import {UserToOrgRepository} from "../../user-org/user-org.repository";
import {mockUserToOrgRepository} from "../../__test__/base.repository.spec";
import {UserRegisterDto} from "../../auth/dto/UserRegisterDto";

const mockUserRepository = () => ({
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    dispose: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
        delete: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        execute: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnThis(),
    })),
});

describe('UserService', () => {
    let userRepository;
    let userService:UserService;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: UserRepository, useFactory: mockUserRepository },
                { provide: UserToOrgRepository, useFactory: mockUserToOrgRepository },
            ],
        }).compile();

        userRepository = module.get<UserRepository>(UserRepository);
        userService = module.get<UserService>(UserService);
    });

    it('findOne', () => {
        const expectedResult: UserEntity = {
            id: '1',
            name: 'example',
            role: RoleType.USER,
            email: 'example@fresco.com',
            password: '123',
            verified: false,
            googleId: null,
            createdAt: new Date(),
            dtoClass: UserDto,
            toDto: () => '',
        };

        userRepository.findOne.mockReturnValue(expectedResult);
        const result = userService.findOne(expectedResult);
        expect(result).toEqual(expectedResult);
    });
    it('findByUsernameOrEmail', () => {
        const expectedResult: Promise<UserEntity> = Promise.resolve({
            id: '1',
            name: 'example',
            role: RoleType.USER,
            email: 'example@fresco.com',
            password: '123',
            verified: false,
            googleId: null,
            createdAt: new Date(),
            dtoClass: UserDto,
            toDto: () => '',
        });

        userRepository.createQueryBuilder = jest.fn(() => ({
            orWhere: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockReturnValue(expectedResult),
        }));
        const result = userService.findByUsernameOrEmail({
            email: 'example@fresco.com',
        });
        expect(result).toEqual(expectedResult);
    });
    it('createUser', () => {
        const expectedResult: Promise<UserEntity> = Promise.resolve({
            id: '1',
            name: 'example',
            role: RoleType.USER,
            email: 'example@fresco.com',
            password: '123',
            verified: false,
            googleId: null,
            createdAt: new Date(),
            dtoClass: UserDto,
            toDto: () => '',
        });
        const mockUser: UserRegisterDto = {

            email: 'example@fresco.com',password:""
        };

        userRepository.create.mockReturnValue({
            id: '1',
            name: 'example',
            role: RoleType.USER,
            email: 'example@fresco.com',
            password: '123',
            verified: false,
            googleId: null,
            dtoClass: UserDto,
            toDto: () => '',
        });

        const result = userService.createUser(mockUser);
        expect(result).toEqual(expectedResult);
    });

    it('checkIfExists', () => {
        const expectedResult: Promise<boolean> = Promise.resolve(true);

        userRepository.createQueryBuilder = jest.fn(() => ({
            where: jest.fn().mockReturnThis(),
            getCount: jest.fn().mockReturnValue(1),
        }));
        const result = userService.checkIfExists('example@fresco.com');
        expect(result).toEqual(expectedResult);
    });
    it('createUserForGoogle', () => {
        const user = {
            id: '2',
            name: 'example',
            role: RoleType.USER,
            email: 'example@fresco.com',
            password: '123',
            verified: false,
            googleId: null,
            createdAt: new Date(),
            dtoClass: UserDto,
            toDto: () => '',
        };
        const expectedResult: Promise<UserEntity> = Promise.resolve(user);

        const mockUserLoginGoogleDto: UserLoginGoogleDto = {
            googleId: '1',
            name: 'example',
            verified: true,
            email: 'example@fresco.com',
        };

        userRepository.create.mockReturnValue(user);
        const result = userService.createUserForGoogle(mockUserLoginGoogleDto);
        expect(result).toEqual(expectedResult);
    });

    it('update', () => {
        const user = {
            id: '2',
            name: 'example',
            role: RoleType.USER,
            email: 'example@fresco.com',
            password: '123',
            verified: false,
            googleId: null,
            createdAt: new Date(),
            dtoClass: UserDto,
            toDto: () => '',
        };
        const expectedResult: Promise<UserEntity> = Promise.resolve(user);

        const mockUserLoginGoogleDto: UserLoginGoogleDto = {
            googleId: '1',
            name: 'example',
            verified: true,
            email: 'example@fresco.com',
        };

        userRepository.create.mockReturnValue(user);
        const result = userService.update(mockUserLoginGoogleDto);
        expect(result).toEqual(expectedResult);
    });
    it('confirmEmail success scenario', () => {
        const user = {
            id: '1',
            name: 'example',
            role: RoleType.USER,
            email: 'example@fresco.com',
            password: '123',
            verified: false,
            googleId: null,
            dtoClass: UserDto,
            toDto: () => '',
        };
        const expectedResult: Promise<UserDto> = Promise.resolve({
            id: '1',
            email: 'test@gmail.com',
            name: 'test user',
            role: RoleType.USER,
        });

        userRepository.update.mockReturnValue({ ...user, verified: true });
        userRepository.findOne.mockResolvedValue({ ...user, verified: true });
        const result = userService.update(new  UserLoginGoogleDto());
        expect(result).toEqual(expectedResult);
    });

    it('validateUser throws UserNotFoundException', () => {
        const expectedResult = new NotFoundException();
        // eslint-disable-next-line @typescript-eslint/require-await
        userRepository.save.mockImplementation(async () => {
            throw new NotFoundException();
        });

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        expect(userService.update(new UserLoginGoogleDto())).rejects.toThrow(expectedResult);
    });
});
