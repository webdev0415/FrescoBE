import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UploadImageController } from './upload-image.controller';
import { UploadImageRepository } from './upload-image.repository';
import { UploadImageService } from './upload-image.service';

@Module({
    imports: [TypeOrmModule.forFeature([UploadImageRepository])],
    controllers: [UploadImageController],
    providers: [UploadImageService],
    exports: [UploadImageService],
})
export class UploadImageModule {}
