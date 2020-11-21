import {Test} from '@nestjs/testing';
import {UtilsService} from '../../../providers/utils.service';
import {CreateBoardDto} from "../dto/CreateBoardDto";
import {UpdateBoardDto} from "../dto/UpdateBoardDto";
import {DeleteBoardDto} from "../dto/DeleteBoardDto";
import {BoardUserOrgRepository} from "../../board-user-org/board-user-org.repository";
import {UserToOrgRepository} from "../../user-org/user-org.repository";
import {UploadImageRepository} from "../../upload/upload-image.repository";
import {CategoryRepository} from "../../category/category.repository";
import {UploadImageService} from "../../upload/upload-image.service";
import {BoardRepository} from "../board.repository";
import {BoardService} from "../board.service";
import {NotFoundException, UnauthorizedException} from "@nestjs/common";
import {BoardEntity} from "../board.entity";
import {CategoryEntity} from "../../category/category.entity";
import {UploadImageEntity} from "../../upload/upload-image.entity";
import {CategoryDto} from "../../category/dto/CategoryDto";
import {UploadImageDto} from "../../upload/dto/UploadImageDto";
import {BoardDto} from "../dto/BoardDto";
import {BoardInfoDto} from "../dto/BoardInfoDto";


const mockCreateBoard: CreateBoardDto = {
    categoryId: "1234",
    data: "test",
    imageId: "test",
    name: "testName",
    orgId: "testOrg"
};

const mockUpdateBoard: UpdateBoardDto = {
    categoryId: "1234",
    data: "test",
    imageId: "test",
    name: "testName",
    orgId: "testOrg", id: "id"
};

const mockDeleteBoardDto: DeleteBoardDto = {
    boardId: "testBoard",
    orgId: "testOrg",
    userId: "testUser"
};

const mockCreateBoardDto:CreateBoardDto={
    orgId:"org",name:"name",imageId:"imageId",data:"data",categoryId:"categoryId"

}

const dateValue = new Date();

const mockCategoryEntity: CategoryEntity = {
    id: "id", name: "category", imageId: "image", toDto: () => {
        return {}
    }
    , createdAt: dateValue, dtoClass: CategoryDto, updatedAt: dateValue
}

const mockImageEntity: UploadImageEntity = {
    id: "imageId", type: "type", path: "path", toDto: () => {
        return {}
    }, updatedAt: dateValue, createdAt: dateValue, dtoClass: UploadImageDto
}
const mockBoardEntity: BoardEntity = {
    id: "id",
    categoryId: "testCategory",
    name: "board",
    toDto: () => {
        let info: BoardInfoDto={
            imageId:"",data:"",categoryId:mockCategoryEntity.id,path:mockImageEntity.path,category:mockCategoryEntity,name:"",orgId:""

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


const mockCategoryRepository = () => ({
    findOne: jest.fn(),find: jest.fn(),
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
})
const mockBoardRepository = mockCategoryRepository

const mockUserToOrgRepository = mockCategoryRepository

const mockBoardUserOrgRepository = mockCategoryRepository

const mockUploadImageRepository = mockCategoryRepository


const mockUploadImageService = () => ({
    getImageById: jest.fn(),

});


const globalMockExpectedResult = {};

describe('AuthService', () => {
    let boardRepository;
    let userToOrgRepository;
    let boardUserOrgRepository;
    let uploadImageRepository;
    let categoryRepository;
    let uploadImageService;
    let boardService;
    beforeEach(async () => {
        UtilsService.validateHash = jest.fn().mockResolvedValue(true);
        const module = await Test.createTestingModule({
            providers: [

                {provide: BoardRepository, useFactory: mockBoardRepository},
                {provide: UserToOrgRepository, useFactory: mockUserToOrgRepository},
                {provide: BoardUserOrgRepository, useFactory: mockBoardUserOrgRepository},
                {provide: UploadImageRepository, useFactory: mockUploadImageRepository},
                {provide: CategoryRepository, useFactory: mockCategoryRepository},
                {provide: UploadImageService, useFactory: mockUploadImageService},
                // { provide: BoardService, useFactory: mockBoardService },
                BoardService
            ],
        }).compile();


        boardRepository = module.get<BoardRepository>(BoardRepository);
        userToOrgRepository = module.get<UserToOrgRepository>(UserToOrgRepository);
        boardUserOrgRepository = module.get<BoardUserOrgRepository>(BoardUserOrgRepository);
        uploadImageRepository = module.get<UploadImageRepository>(UploadImageRepository);
        categoryRepository = module.get<CategoryRepository>(CategoryRepository);
        uploadImageService = module.get<UploadImageService>(UploadImageService);
        boardService = module.get<BoardService>(BoardService);
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

                await boardService.isAdminOrEditor("testUser", "testOrg");
            } catch (e) {
                console.log(e)
                await expect(e).toEqual(new UnauthorizedException())
            }

        });


    });

    describe('GetById', () => {


        it(' return BoardInfoDto and not undefined ', async () => {

            boardRepository.findOne.mockReturnValue(mockBoardEntity);
            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            uploadImageRepository.findOne.mockReturnValue(mockImageEntity);

            const result = await boardService.getById("id")
            expect(result).not.toEqual(undefined)
            expect(result.categoryId).toEqual(mockCategoryEntity.id)
            expect(result.path).toEqual(mockImageEntity.path)

        });

        it(' throws NotFoundException ', async () => {

            boardRepository.findOne.mockReturnValue(undefined);

            try {
                 await boardService.getById("id")
            }
            catch (e) {
                expect(e).toEqual(new NotFoundException())
            }

        });
    });

    describe('getByOrgId', () => {


        it(' return BoardInfoDto[] with one object and not undefined ', async () => {

            boardRepository.find.mockReturnValue([mockBoardEntity]);
            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            uploadImageRepository.findOne.mockReturnValue(mockImageEntity);

            const result = await boardService.getByOrgId("id")

            expect(result).not.toBeUndefined();
            expect(result.length).toEqual(1);
            expect(result[0].categoryId).toEqual(mockCategoryEntity.id)
            expect(result[0].path).toEqual(mockImageEntity.path)

        });

        it(' return BoardInfoDto[] with Zero object and not undefined', async () => {

            boardRepository.find.mockReturnValue([]);

            const result = await boardService.getByOrgId("invalidId")

            expect(result).not.toBeUndefined();
            expect(result.length).toEqual(0);

        });
    });

    describe('create', () => {


        it(' Create with data', async () => {

            boardRepository.save.mockReturnValue([mockBoardEntity]);
            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            uploadImageService.getImageById.mockReturnValue(mockImageEntity);

            const result = await boardService.create("id",mockCreateBoardDto)

            expect(result).not.toBeUndefined();
            expect(result.length).toEqual(1);
            expect(result[0].categoryId).toEqual(mockCategoryEntity.id)
            expect(result[0].path).toEqual(mockImageEntity.path)

        });

        it(' return BoardInfoDto[] with Zero object and not undefined', async () => {

            boardRepository.find.mockReturnValue([]);

            const result = await boardService.getByOrgId("invalidId")

            expect(result).not.toBeUndefined();
            expect(result.length).toEqual(0);

        });
    });

});
