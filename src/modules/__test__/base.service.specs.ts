export const dateValue = new Date();

export const globalMockExpectedResult = {};


export const mockUploadImageService = () => ({
    getImageById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),

});
export const mockCategoryService = () => ({
    getById: jest.fn(),
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),

});
export const mockAuthService = () => ({
    getUserByEmail: jest.fn(), createToken: jest.fn().mockReturnValue({accessToken:"token",expiresIn:200}),

});
export const mockMailService = () => ({
    sendInvitationEmail: jest.fn(),

});

export const mockDefaultTemplateService = () => ({

    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
});


export const mockMessageService = () => ({
    find: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    checkPermission: jest.fn(),
    getCount: jest.fn(),
});

export const mockValidatorService = () => ({

    isImage: jest.fn(),
});
export const mockAwsS3Service = () => ({

    uploadImage: jest.fn(),
});
export const mockUserService = () => ({

    suggestEmail: jest.fn(),
});

export const mockBoardService = () => ({

    getById: jest.fn(),
    getByOrgId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
});
export const mockCanvasService = () => ({

    getById: jest.fn(),
    getByOrgId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
});

export const mockInvitationService = () => ({
    create: jest.fn(),
    resendInvitation: jest.fn(),
    checkValidToken: jest.fn(),
    verify: jest.fn(),
    updateToVerified: jest.fn(),
});

export const mockOrganizationService = () => ({

    getById: jest.fn(),
    getByOrgId: jest.fn(),
    create: jest.fn(),
    getOrganizationByUserId: jest.fn(),
    getOrganizationByUserAndOrgId: jest.fn(),
});
