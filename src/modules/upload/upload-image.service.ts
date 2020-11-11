import { Injectable } from '@nestjs/common';

import { FileNotImageException } from '../../exceptions/file-not-image.exception';
import { IFile } from '../../interfaces/IFile';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { CreateUploadImageDto } from './dto/CreateUploadImageDto';
import { UploadImageEntity } from './upload-image.entity';
import { UploadImageRepository } from './upload-image.repository';

@Injectable()
export class UploadImageService {
    constructor(
        public readonly defaultTemplateRepository: UploadImageRepository,
        public readonly validatorService: ValidatorService,
        public readonly awsS3Service: AwsS3Service,
    ) {}

    // eslint-disable-next-line complexity
    async create(
        defaultTemplateDto: CreateUploadImageDto,
        file: IFile,
    ): Promise<UploadImageEntity> {
        const defaultTemplateModel = new UploadImageEntity();
        defaultTemplateModel.type = defaultTemplateDto.type;
        let path: string;
        if (file && !this.validatorService.isImage(file.mimetype)) {
            throw new FileNotImageException();
        }

        if (file) {
            path = await this.awsS3Service.uploadImage(file);
        }
        return this.defaultTemplateRepository.save({
            ...defaultTemplateModel,
            path,
        });
    }
}
