import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserToOrgRepository } from '../user-org/user-org.repository';
import { CanvasController } from './canvas.controller';
import { CanvasRepository } from './canvas.repository';
import { CanvasService } from './canvas.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserToOrgRepository, CanvasRepository]),
    ],
    controllers: [CanvasController],
    providers: [CanvasService],
    exports: [CanvasService],
})
export class CanvasModule {}
