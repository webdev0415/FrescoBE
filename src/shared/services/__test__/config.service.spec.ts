import {join} from 'path';
import {ConfigService} from '../config.service';

describe('ConfigService', () => {
    const configService = new ConfigService();

    it('isDevelopment', () => {
        if (configService.nodeEnv === 'development') {
            expect(configService.isDevelopment).toEqual(true);
        } else {
            expect(configService.isDevelopment).toEqual(false);
        }
    });

    it('isProduction', () => {
        if (configService.nodeEnv === 'production') {
            expect(configService.isProduction).toEqual(true);
        } else {
            expect(configService.isProduction).toEqual(false);
        }
    });

    // it('smtpConfig', () => {
    //     expect(configService.smtpConfig).toEqual({
    //         host: configService.get('SMTP_HOST'),
    //         port: configService.get('SMTP_PORT'),
    //         user: configService.get('SMTP_USER'),
    //         password: configService.get('SMTP_PASSWORD'),
    //         defaultFrom: configService.get('SMTP_DEFAULT_FROM'),
    //     });
    // });

    it('typeOrmConfig', () => {
        const path = join(__dirname, '../');
        const entities = [path + '../../modules/**/*.entity{.ts,.js}'];
        const migrations = [path + '../../migrations/*{.ts,.js}'];
        // expect(configService.typeOrmConfig).toEqual({
        //     entities,
        //     migrations,
        //     keepConnectionAlive: true,
        //     type: 'mysql',
        //     host: configService.get('DB_HOST'),
        //     port: configService.getNumber('DB_PORT'),
        //     username: configService.get('DB_USERNAME'),
        //     password: configService.get('DB_PASSWORD'),
        //     database: configService.get('DB_DATABASE'),
        //     migrationsRun: true,
        //     logging: configService.nodeEnv === 'development',
        //     namingStrategy: new SnakeNamingStrategy(),
        // });

        expect(configService.typeOrmConfig).not.toBeUndefined()
    });

    it('getNumber', () => {
        expect(configService.getNumber('DB_PORT')).toEqual(
            Number(configService.get('DB_PORT')),
        );
    });

    it('nodeEnv', () => {
        expect(configService.nodeEnv).toBeTruthy();
    });

    it('All environment variables should be present', () => {
        expect(configService.get('DB_PORT')).toBeTruthy();
        expect(configService.get('JWT_SECRET_KEY')).toBeTruthy();
        expect(configService.get('JWT_EXPIRATION_TIME')).toBeTruthy();

        expect(configService.get('DB_HOST')).toBeTruthy();
        expect(configService.get('DB_PORT')).toBeTruthy();
        expect(configService.get('DB_USERNAME')).toBeTruthy();
        expect(configService.get('DB_PASSWORD')).toBeTruthy();
        expect(configService.get('DB_DATABASE')).toBeTruthy();

       // expect(configService.get('SMTP_HOST')).toBeTruthy();
       // expect(configService.get('SMTP_PORT')).toBeTruthy();
       // expect(configService.get('SMTP_USER')).toBeTruthy();
       // expect(configService.get('SMTP_PASSWORD')).toBeTruthy();
     //   expect(configService.get('SMTP_DEFAULT_FROM')).toBeTruthy();

        expect(configService.get('GOOGLE_CLIENT_ID')).toBeTruthy();
        expect(configService.get('GOOGLE_SECRET')).toBeTruthy();
        expect(configService.get('CALL_BACK_URL')).toBeTruthy();

        expect(configService.get('CLIENT_URL')).toBeTruthy();
    });
});
