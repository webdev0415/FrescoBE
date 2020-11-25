

export const mockGeneratorService = () => ({

    fileName: jest.fn(),

});

export const mockConfigService = () => ({

    awsS3Config: jest.fn(),

});
export function moduleHotAccept(mod) {
    if (mod && mod.hot) {
        mod.hot.accept();
    }
}
