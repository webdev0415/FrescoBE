import {CanvasRepository} from "../canvas/canvas.repository";
import {UserToOrgRepository} from "../user-org/user-org.repository";
import {CategoryRepository} from "../category/category.repository";
import {UploadImageRepository} from "../upload/upload-image.repository";
import {UploadImageService} from "../upload/upload-image.service";
import {globalMockExpectedResult} from "./base.service.specs";


export const mockCategoryRepository = () => ({
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),count: jest.fn(),
    update: jest.fn(),
    dispose: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
        delete: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        execute: jest.fn().mockReturnThis(),
        getOne: jest.fn()
    })),
})
export const mockBoardRepository = mockCategoryRepository

export const mockUserToOrgRepository = mockCategoryRepository

export const mockBoardUserOrgRepository = mockCategoryRepository

export const mockCanvasRepository = mockCategoryRepository

export const mockDefaultTemplateRepository = mockCategoryRepository


export const mockUploadImageRepository = mockCategoryRepository


export const mockInvitationRepository = mockCategoryRepository

export const mockOrganizationRepository = mockCategoryRepository

