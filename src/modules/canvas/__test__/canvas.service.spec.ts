import {Test} from '@nestjs/testing';

import {BoardUserOrgRepository} from "../../board-user-org/board-user-org.repository";
import {UserToOrgRepository} from "../../user-org/user-org.repository";
import {UploadImageRepository} from "../../upload/upload-image.repository";
import {CategoryRepository} from "../../category/category.repository";
import {UploadImageService} from "../../upload/upload-image.service";

import {NotFoundException, UnauthorizedException} from "@nestjs/common";
import {CanvasRepository} from "../canvas.repository";
import {BoardService} from "../../board/board.service";
import {
    mockBoardRepository,
    mockBoardUserOrgRepository,
    mockCanvasRepository, mockCanvasUserOrgRepository,
    mockCategoryRepository,
    mockUploadImageRepository,
    mockUserToOrgRepository
} from "../../__test__/base.repository.spec";
import {BoardRepository} from "../../board/board.repository";
import {CanvasService} from "../canvas.service";
import {mockBoardEntity, mockCategoryEntity, mockImageEntity,} from "../../board/__test__/board.service.spec";
import {BoardDto} from "../../board/dto/BoardDto";
import {CanvasEntity} from "../canvas.entity";
import {CanvasDto} from "../dto/CanvasDto";
import {DeleteBoardDto} from "../../board/dto/DeleteBoardDto";
import {CreateCanvasDto} from "../dto/CreateCanvasDto";
import {UpdateCanvasDto} from "../dto/UpdateCanvasDto";
import {dateValue, globalMockExpectedResult, mockUploadImageService} from "../../__test__/base.service.specs";
import {CanvasUserOrgRepository} from "../../canvas-user-org/canvas-user-org.repository";

export const mockCanvasEntity: CanvasEntity = {
    id: "id",
    categoryId: "testCategory",
    name: "board",
    toDto: () => {
        let info: CanvasDto = {
            imageId: "", data: "", categoryId: mockCategoryEntity.id, name: "", orgId: "",createdUserId:"createdUserId",id:"id"

        }

        return info;
    },
    createdAt: dateValue,
    createdUserId: "id",
    data: "",
    imageId: "image",
    orgId: "org",
    updatedAt: dateValue,
    dtoClass: BoardDto

}
export const mockCreateCanvasDto:CreateCanvasDto={
    orgId:"org",name:"name",imageId:"imageId",data:"data",categoryId:"categoryId",path:""

}
export const mockUpdateCanvasDto:UpdateCanvasDto={
    orgId:"org",name:"name",imageId:"imageId",data:"data",categoryId:"categoryId",path:"",id:"id"

}

describe('CanvasService', () => {
    let boardRepository;
    let userToOrgRepository;
    let boardUserOrgRepository;
    let uploadImageRepository;
    let categoryRepository;
    let uploadImageService;
    let canvasRepository;
    let boardService: BoardService;
    let canvasService: CanvasService;
    beforeEach(async () => {

        const module = await Test.createTestingModule({
            providers: [
                {provide: BoardRepository, useFactory: mockBoardRepository},
                {provide: UserToOrgRepository, useFactory: mockUserToOrgRepository},
                {provide: BoardUserOrgRepository, useFactory: mockBoardUserOrgRepository},
                {provide: UploadImageRepository, useFactory: mockUploadImageRepository},
                {provide: CategoryRepository, useFactory: mockCategoryRepository},
                {provide: UploadImageService, useFactory: mockUploadImageService},
                {provide: CanvasRepository, useFactory: mockCanvasRepository},
                {provide: CanvasUserOrgRepository, useFactory: mockCanvasUserOrgRepository},
                CanvasService, BoardService
            ],
        }).compile();

        boardRepository = module.get<BoardRepository>(BoardRepository);
        userToOrgRepository = module.get<UserToOrgRepository>(UserToOrgRepository);
        boardUserOrgRepository = module.get<BoardUserOrgRepository>(BoardUserOrgRepository);
        uploadImageRepository = module.get<UploadImageRepository>(UploadImageRepository);
        categoryRepository = module.get<CategoryRepository>(CategoryRepository);
        uploadImageService = module.get<UploadImageService>(UploadImageService);
        canvasRepository = module.get<CanvasRepository>(CanvasRepository);
        boardService = module.get<BoardService>(BoardService);
        canvasService = module.get<CanvasService>(CanvasService);
    });

    describe('isAdminOrEditor', () => {

        it('Find and return userToOrg ', async () => {

            userToOrgRepository.createQueryBuilder = jest.fn(() => ({
                andWhere: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValue(globalMockExpectedResult),
            }));

            const result = await boardService.isAdminOrEditor("testUser", "testOrg")
            expect(result).toEqual(globalMockExpectedResult);
        });

        it('isAdminOrEditor throws UnauthorizedException', async () => {
            userToOrgRepository.createQueryBuilder = jest.fn(() => ({
                andWhere: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValue(null),
            }));
            try {

                await canvasService.isAdminOrEditor("testUser", "testOrg");
            } catch (e) {
                console.log(e)
                await expect(e).toEqual(new UnauthorizedException())
            }

        });


    });

    describe('getById', () => {

        it(' return  one object and not undefined ', async () => {

            boardRepository.findOne.mockReturnValue([mockBoardEntity]);
            canvasRepository.findOne.mockReturnValue(mockCanvasEntity);
            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            uploadImageRepository.findOne.mockReturnValue(mockImageEntity);


            const result = await canvasService.getById("id")

            expect(result).not.toBeUndefined();

            expect(result.name).toEqual(mockBoardEntity.toDto().name)

        });

        it(' throws NotFoundException', async () => {

            canvasRepository.findOne.mockReturnValue(undefined);

            const result = canvasService.getById("invalidId")
            let rejected = false
            try {
                const response = await result;

            } catch (e) {
                rejected = true;
                expect(e).toEqual(new NotFoundException())
            }
            expect(rejected).toBeTruthy();

        });
    });
    describe('getByOrgId', () => {

        it(' return [] with one object and not undefined ', async () => {

            canvasRepository.find.mockReturnValue([mockCanvasEntity]);
            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            uploadImageRepository.findOne.mockReturnValue(mockImageEntity);

            const result = await canvasService.getByOrgId("id")

            expect(result).not.toBeUndefined();


        });

        it(' return [] with Zero object and not undefined', async () => {

            canvasRepository.find.mockReturnValue([]);

            const result = await canvasService.getByOrgId("invalidId")

            expect(result).not.toBeUndefined();
            expect(result.length).toEqual(0);

        });
    });
    describe('create', () => {

        it(' Create with data', async () => {
            userToOrgRepository.createQueryBuilder = jest.fn(() => ({
                andWhere: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValue(globalMockExpectedResult),
            }));

            canvasRepository.save.mockImplementation(async (value)=>value);
            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            uploadImageService.getImageById.mockReturnValue(mockImageEntity);
            boardUserOrgRepository.save.mockImplementation(async (value)=>value)

            const result = await canvasService.create("id",mockCreateCanvasDto)

            expect(result).not.toBeUndefined();

        });

    });

    describe('Update', () => {

        it('Update canvas entity, successfull', async () => {
            userToOrgRepository.createQueryBuilder = jest.fn(() => ({
                andWhere: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValue(globalMockExpectedResult),
            }));
            canvasRepository.save.mockImplementation(async (value)=>value);
            categoryRepository.findOne.mockReturnValue(undefined);
            uploadImageService.getImageById.mockReturnValue(mockImageEntity);
            boardUserOrgRepository.save.mockImplementation(async (value)=>value)
            canvasRepository.findOne.mockReturnValue(mockCanvasEntity);
            const result = await canvasService.update("id",mockUpdateCanvasDto)



            expect(result).not.toBeUndefined();


        });

        it('Update canvas entity, Throw NotFoundException', async () => {
            userToOrgRepository.createQueryBuilder = jest.fn(() => ({
                andWhere: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValue(globalMockExpectedResult),
            }));
            boardRepository.save.mockImplementation(async (value)=>value);
            categoryRepository.findOne.mockReturnValue(undefined);
            uploadImageService.getImageById.mockReturnValue(mockImageEntity);
            boardUserOrgRepository.save.mockImplementation(async (value)=>value)
            canvasRepository.findOne.mockReturnValue(undefined);

            let result=canvasService.update("id",mockUpdateCanvasDto)
            let rejected=false
            try {
                const response = await result;

            }
            catch (e) {
                rejected=true;
                expect(e).toEqual(new NotFoundException())
            }
            expect(rejected).toBeTruthy();

        });
    });

    describe('delete', () => {


        it('delete canvas entity, successfull', async () => {
            userToOrgRepository.createQueryBuilder = jest.fn(() => ({
                andWhere: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValue(globalMockExpectedResult),
            }));
            boardRepository.delete.mockImplementation(async (value)=>value);
            categoryRepository.findOne.mockReturnValue(undefined);
            uploadImageService.getImageById.mockReturnValue(mockImageEntity);
            boardUserOrgRepository.delete.mockImplementation(async (value)=>value)
            boardRepository.findOne.mockReturnValue(mockBoardEntity);
            const result = await boardService.delete(new DeleteBoardDto())

            expect(result).toBeUndefined()


        });

    });


});
