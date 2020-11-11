import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryRepository } from '../../modules/category/category.repository';
import { UserToOrgRepository } from '../user-org/user-org.repository';
import { CanvasController } from './canvas.controller';
import { CanvasRepository } from './canvas.repository';
import { CanvasService } from './canvas.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserToOrgRepository,
            CanvasRepository,
            CategoryRepository,
        ]),
    ],
    controllers: [CanvasController],
    providers: [CanvasService],
    exports: [CanvasService],
})
export class CanvasModule {}
