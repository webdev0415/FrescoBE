import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryRepository } from '../../modules/category/category.repository';
import { UploadImageModule } from '../../modules/upload/upload-image.module';
import { UploadImageRepository } from '../../modules/upload/upload-image.repository';
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
            UploadImageRepository,
        ]),
        UploadImageModule,
    ],
    controllers: [CanvasController],
    providers: [CanvasService],
    exports: [CanvasService],
})
export class CanvasModule {}
