import { UtilsService } from '../utils.service';

describe('UtilsService', () => {
    it('generateHash', () => {
        expect(UtilsService.generateHash('123')).toBeTruthy();
    });

    it('generateRandomString', () => {
        expect(UtilsService.generateRandomString(123)).toBeTruthy();
    });

    it('validateHash', () => {
        expect(UtilsService.validateHash('123', '123hash')).toBeTruthy();
    });
});
