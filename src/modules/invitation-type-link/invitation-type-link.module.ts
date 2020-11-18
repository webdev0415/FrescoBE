import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CanvasModule } from '../../modules/canvas/canvas.module';
import { CanvasRepository } from '../canvas/canvas.repository';
import { InvitationTypeLinkController } from './invitation-type-link.controller';
import { InvitationTypeLinkRepository } from './invitation-type-link.repository';
import { InvitationTypeLinkService } from './invitation-type-link.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            InvitationTypeLinkRepository,
            CanvasRepository,
        ]),
        forwardRef(() => CanvasModule),
    ],
    controllers: [InvitationTypeLinkController],
    providers: [InvitationTypeLinkService],
    exports: [InvitationTypeLinkService],
})
export class InvitationTypeLinkModule {}
