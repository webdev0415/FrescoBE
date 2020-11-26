/* eslint-disable @typescript-eslint/no-unused-vars */

import {UserEntity} from "../user.entity";
import {UserController} from "../user.controller";
import {Test} from "@nestjs/testing";
import {UserService} from "../user.service";

import {AutoSuggestEmailDto} from "../dto/AutoSuggestEmailDto";
import {UserDto} from "../dto/UserDto";
import {mockUserService} from "../../__test__/base.service.specs";

let mockUserEntity: UserEntity = new UserEntity();


describe('UserController', () => {

    let userController: UserController;
    let userService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({


            providers: [
                UserController,
                {provide: UserService, useFactory: mockUserService},
            ],
        }).compile();

        userController = module.get<UserController>(UserController);
        userService = module.get<UserService>(UserService);

    });
    describe('suggest ', () => {
        it('should return User dto list', async () => {
            userService.suggestEmail.mockResolvedValue([new UserDto(mockUserEntity)]);
            let result = await userController.suggestEmail(new AutoSuggestEmailDto());
            expect(result).toEqual([new UserDto(mockUserEntity)])
        });
    });


});
