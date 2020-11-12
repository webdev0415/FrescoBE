import { Injectable } from '@nestjs/common';

import { FileNotImageException } from '../../exceptions/file-not-image.exception';
import { IFile } from '../../interfaces/IFile';
import { CanvasRepository } from '../../modules/canvas/canvas.repository';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { CreateUploadImageDto } from './dto/CreateUploadImageDto';
import { UploadImageEntity } from './upload-image.entity';
import { UploadImageRepository } from './upload-image.repository';

@Injectable()
export class UploadImageService {
    constructor(
        public readonly uploadImageRepository: UploadImageRepository,
        public readonly canvasRepository: CanvasRepository,
        public readonly validatorService: ValidatorService,
        public readonly awsS3Service: AwsS3Service,
    ) {}

    // eslint-disable-next-line complexity
    async create(
        uploadImageDto: CreateUploadImageDto,
        file: IFile,
    ): Promise<UploadImageEntity> {
        // console.log(file);
        const uploadImageModel = new UploadImageEntity();
        uploadImageModel.type = uploadImageDto.type;
        uploadImageModel.createdAt = new Date();
        uploadImageModel.updatedAt = new Date();
        let path: string;
        if (file && !this.validatorService.isImage(file.mimetype)) {
            throw new FileNotImageException();
        }

        if (file) {
            path = await this.awsS3Service.uploadImage(file);
        }
        return this.uploadImageRepository.save({
            ...uploadImageModel,
            path,
        });
    }

    // eslint-disable-next-line complexity
    async update(
        uploadImageDto: CreateUploadImageDto,
        id: string,
        file: IFile,
    ): Promise<UploadImageEntity> {
        if (uploadImageDto.type === 'canvas') {
            const canvas = await this.canvasRepository.findOne({
                where: {
                    id,
                },
            });
            const image = await this.uploadImageRepository.findOne({
                where: {
                    id: canvas.image,
                },
            });

            let path: string;
            if (file && !this.validatorService.isImage(file.mimetype)) {
                throw new FileNotImageException();
            }
            if (file) {
                path = await this.awsS3Service.uploadImage(file);
            }

            image.updatedAt = new Date();
            image.path = path;
            return this.uploadImageRepository.save(image);
        }
    }
}
