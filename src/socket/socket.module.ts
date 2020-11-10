import { forwardRef, Module } from '@nestjs/common';

import { UserModule } from '../modules/user/user.module';
// import { ConfigService } from '../shared/services/config.service';
import { SocketGateway } from './socket.gateway';

@Module({
    imports: [forwardRef(() => UserModule)],
    providers: [SocketGateway],
})
export class SocketModule {}