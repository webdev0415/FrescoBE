import { forwardRef, Module } from '@nestjs/common';

import { UserModule } from '../../modules/user/user.module';
// import { ConfigService } from '../shared/services/config.service';
import { BoardGateway } from './board.gateway';

@Module({
    imports: [forwardRef(() => UserModule)],
    providers: [BoardGateway],
})
export class BoardGatewayModule {}
