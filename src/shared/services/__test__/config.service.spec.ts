import { join } from 'path';

import { SnakeNamingStrategy } from '../../../snake-naming.strategy';
import { UserSubscriber } from '../../entity-subscribers/user-subscriber';
import { ConfigService } from '../config.service';

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

    it('sendGridConfig', () => {
        expect(configService.sendGridConfig).toEqual({
            sendGridApiKey: configService.get('SENDGRID_API_KEY'),
            emailFrom: configService.get('EMAIL_FROM'),
        });
    });

    it('typeOrmConfig', () => {
        const path = join(__dirname, '../');
        const entities = [path + '../../modules/**/*.entity{.ts,.js}'];
        const migrations = [path + '../../migrations/*{.ts,.js}'];
        expect(configService.typeOrmConfig).toEqual({
            entities,
            migrations,
            keepConnectionAlive: true,
            type: 'mysql',
            host: configService.get('DB_HOST'),
            port: configService.getNumber('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_DATABASE'),
            subscribers: [UserSubscriber],
            migrationsRun: true,
            logging: configService.nodeEnv === 'development',
            namingStrategy: new SnakeNamingStrategy(),
        });
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

        expect(configService.get('SENDGRID_API_KEY')).toBeTruthy();
        expect(configService.get('EMAIL_FROM')).toBeTruthy();

        expect(configService.get('GOOGLE_CLIENT_ID')).toBeTruthy();
        expect(configService.get('GOOGLE_SECRET')).toBeTruthy();
        expect(configService.get('CALL_BACK_URL')).toBeTruthy();

        expect(configService.get('CLIENT_URL')).toBeTruthy();
    });
});
