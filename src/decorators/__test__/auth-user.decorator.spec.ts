import { AuthUser } from '../auth-user.decorator';

describe('AuthUser', () => {
    it('AuthUser snapshot ', () => {
        expect(AuthUser).toMatchSnapshot();
    });
});
