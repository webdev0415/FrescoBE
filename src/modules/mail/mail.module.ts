import { Module } from '@nestjs/common';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';

import { ConfigService } from '../../shared/services/config.service';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
    imports: [
        SendGridModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                apiKey: configService.sendGridConfig.sendGridApiKey,
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [MailController],
    exports: [MailService],
    providers: [MailService],
})
export class MailModule {}
