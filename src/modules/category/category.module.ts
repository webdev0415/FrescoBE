import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UploadImageRepository } from '../../modules/upload/upload-image.repository';
import { UserToOrgRepository } from '../user-org/user-org.repository';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './category.repository';
import { CategoryService } from './category.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserToOrgRepository,
            CategoryRepository,
            UploadImageRepository,
        ]),
    ],
    controllers: [CategoryController],
    providers: [CategoryService],
    exports: [CategoryService],
})
export class CategoryModule {}
