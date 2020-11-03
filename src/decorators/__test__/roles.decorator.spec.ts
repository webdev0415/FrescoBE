import { Roles } from '../roles.decorator';

describe('Roles', () => {
    it('Roles snapshot ', () => {
        expect(Roles).toMatchSnapshot();
    });
});
