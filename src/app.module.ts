// import './boilerplate.polyfill';

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {
    CacheInterceptor,
    CacheModule,
    MiddlewareConsumer,
    Module,
    NestModule,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { contextMiddleware } from './middlewares';
import { AuthModule } from './modules/auth/auth.module';
import { BoardModule } from './modules/board/board.module';
import { CanvasModule } from './modules/canvas/canvas.module';
import { DefaultTemplateModule } from './modules/default-template/default-template.module';
import { InvitationModule } from './modules/invitation/invitation.module';
import { MailModule } from './modules/mail/mail.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { UserModule } from './modules/user/user.module';
import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';
import { SocketModule } from './socket/socket.module';
@Module({
    imports: [
        CacheModule.registerAsync({
            useFactory: () => ({
                ttl: 3600, // seconds
                max: 100, // maximum number of items in cache
            }),
        }),
        AuthModule,
        UserModule,
        MailModule,
        InvitationModule,
        OrganizationModule,
        BoardModule,
        DefaultTemplateModule,
        CanvasModule,
        SocketModule,
        TypeOrmModule.forRootAsync({
            imports: [SharedModule],
            useFactory: (configService: ConfigService) =>
                configService.typeOrmConfig,
            inject: [ConfigService],
        }),
        MailerModule.forRootAsync({
            imports: [MailerModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const {
                    host,
                    port,
                    user,
                    password,
                    defaultFrom,
                } = configService.smtpConfig;
                return {
                    transport: {
                        host,
                        port,
                        // secure: true,
                        // tls: { ciphers: 'SSLv3' }, // gmail
                        auth: {
                            user,
                            pass: password,
                        },
                    },
                    defaults: {
                        from: defaultFrom,
                    },
                    template: {
                        dir: __dirname + '/templates',
                        adapter: new HandlebarsAdapter(),
                        options: {
                            strict: true,
                        },
                    },
                };
            },
        }),
    ],
    // providers: [
    //     {
    //         provide: APP_INTERCEPTOR,
    //         useClass: CacheInterceptor,
    //     },
    // ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
        consumer.apply(contextMiddleware).forRoutes('*');
    }
}
