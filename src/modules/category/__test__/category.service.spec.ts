import {Test} from '@nestjs/testing';
import {UtilsService} from '../../../providers/utils.service';

import {BoardUserOrgRepository} from "../../board-user-org/board-user-org.repository";
import {UserToOrgRepository} from "../../user-org/user-org.repository";
import {UploadImageRepository} from "../../upload/upload-image.repository";
import {CategoryRepository} from "../../category/category.repository";
import {UploadImageService} from "../../upload/upload-image.service";

import {NotFoundException, UnauthorizedException} from "@nestjs/common";

import {BoardService} from "../../board/board.service";
import {
    mockBoardRepository,
    mockBoardUserOrgRepository,

    mockCategoryRepository,
    mockUploadImageRepository,
    mockUserToOrgRepository
} from "../../__test__/base.repository.spec";
import {dateValue, globalMockExpectedResult, mockUploadImageService} from "../../__test__/base.service.specs";
import {BoardDto} from "../../board/dto/BoardDto";
import {mockBoardEntity, mockCategoryEntity, mockImageEntity} from "../../board/__test__/board.service.spec";
import {DeleteBoardDto} from "../../board/dto/DeleteBoardDto";
import {UpdateCanvasDto} from "../../canvas/dto/UpdateCanvasDto";
import {CreateCanvasDto} from "../../canvas/dto/CreateCanvasDto";
import {CanvasDto} from "../../canvas/dto/CanvasDto";
import {CanvasService} from "../../canvas/canvas.service";
import {CanvasEntity} from "../../canvas/canvas.entity";
import {BoardRepository} from "../../board/board.repository";
import {CategoryService} from "../category.service";
import {CreateCategoryDto} from "../dto/CreateCategoryDto";
import {UpdateCategoryDto} from "../dto/UpdateCategoryDto";
import {DeleteCategoryDto} from "../dto/DeleteCategoryDto";


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
export const mockCreateCategoryDto:CreateCategoryDto={
    name:"name",imageId:"imageId",path:"path"
}
export const mockUpdateCategoryDto:UpdateCategoryDto={
    name:"name",imageId:"imageId",path:"path",
    id:"id"
}
describe('CategoryService', () => {

    let uploadImageRepository;
    let categoryRepository;
    let uploadImageService;
    let canvasRepository;
    let boardService: BoardService;
    let categoryService: CategoryService;
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

                 BoardService,CategoryService
            ],
        }).compile();

      uploadImageRepository = module.get<UploadImageRepository>(UploadImageRepository);
        categoryRepository = module.get<CategoryRepository>(CategoryRepository);
        uploadImageService = module.get<UploadImageService>(UploadImageService);

        boardService = module.get<BoardService>(BoardService);
        categoryService = module.get<CategoryService>(CategoryService);
    });


    describe('getById', () => {

        it(' return  one object and not undefined ', async () => {

            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            uploadImageRepository.findOne.mockReturnValue(mockImageEntity);


            const result = await categoryService.getById("id")

            expect(result).not.toBeUndefined();

            expect(result.name).toEqual(mockCategoryEntity.name)

        });

        it(' throws NotFoundException', async () => {

            categoryRepository.findOne.mockReturnValue(undefined);

            const result = categoryService.getById("invalidId")
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
    describe('getAll', () => {

        it(' return [] with one object and not undefined ', async () => {

            categoryRepository.find.mockReturnValue([mockCategoryEntity]);
            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            uploadImageRepository.findOne.mockReturnValue(mockImageEntity);

            const result = await categoryService.getAll()

            expect(result).not.toBeUndefined();


        });

        it(' return [] with Zero object and not undefined', async () => {

            categoryRepository.find.mockReturnValue([]);

            const result = await categoryService.getAll()

            expect(result).not.toBeUndefined();
            expect(result.length).toEqual(0);

        });
    });
    describe('create', () => {

        it(' Create with data', async () => {
            categoryRepository.createQueryBuilder = jest.fn(() => ({
                andWhere: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValue(globalMockExpectedResult),

                save: jest.fn().mockImplementation(async (value)=>value),
                delete: jest.fn().mockImplementation(async (value)=>value),
            }));

            categoryRepository.save.mockImplementation(async (value)=>value);
            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            uploadImageService.getImageById.mockReturnValue(mockImageEntity);

            const result = await categoryService.create(mockCreateCategoryDto)

            expect(result).not.toBeUndefined();

        });

    });

    describe('Update', () => {

        it('Update canvas entity, successfull', async () => {
            categoryRepository.createQueryBuilder = jest.fn(() => ({
                andWhere: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValue(globalMockExpectedResult),
                save: jest.fn().mockImplementation(async (value)=>value),
                delete: jest.fn().mockImplementation(async (value)=>value),
            }));
            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            categoryRepository.save.mockImplementation(async (value)=>value);
            uploadImageService.getImageById.mockReturnValue(mockImageEntity);
            const result = await categoryService.update(mockUpdateCategoryDto)



            expect(result).not.toBeUndefined();


        });

        it('Update canvas entity, Throw NotFoundException', async () => {
            categoryRepository.createQueryBuilder = jest.fn(() => ({
                andWhere: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValue(globalMockExpectedResult),
            }));
            categoryRepository.findOne.mockReturnValue(undefined);
            uploadImageService.getImageById.mockReturnValue(mockImageEntity);

            let result=categoryService.update(mockUpdateCategoryDto)
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

        it('delete successfull', async () => {

            categoryRepository.delete.mockImplementation(async (value)=>value);

            const result = await categoryService.delete(new DeleteCategoryDto())


            expect(result).toBeUndefined()

        });

    });


});
