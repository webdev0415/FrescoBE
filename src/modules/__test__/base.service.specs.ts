import {TokenPayloadDto} from "../auth/dto/TokenPayloadDto";

export const dateValue = new Date();

export const globalMockExpectedResult = {};


export const mockUploadImageService = () => ({
    getImageById: jest.fn(),

});
export const mockCategoryService = () => ({


});
export const mockAuthService = () => ({
    getUserByEmail: jest.fn(), createToken: jest.fn().mockReturnValue({accessToken:"token",expiresIn:200}),

});
export const mockMailService = () => ({
    sendInvitationEmail: jest.fn(),

});

