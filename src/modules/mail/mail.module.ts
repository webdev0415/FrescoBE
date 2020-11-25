import {Module} from '@nestjs/common';

import {MailController} from './mail.controller';
import {MailService} from './mail.service';

@Module({
    imports: [],
    controllers: [MailController],
    exports: [MailService],
    providers: [MailService],
})
export class MailModule {}
