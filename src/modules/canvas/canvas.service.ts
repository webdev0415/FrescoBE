/* eslint-disable complexity */
import {Injectable, NotFoundException, UnauthorizedException,} from '@nestjs/common';

import {PermissionEnum} from '../../common/constants/permission';
import {CategoryRepository} from '../../modules/category/category.repository';
import {UploadImageRepository} from '../../modules/upload/upload-image.repository';
import {UploadImageService} from '../../modules/upload/upload-image.service';
import {UserToOrgRepository} from '../../modules/user-org/user-org.repository';
import {CanvasEntity} from './canvas.entity';
import {CanvasRepository} from './canvas.repository';
import {CanvasInfoDto} from './dto/CanvasInfoDto';
import {CreateCanvasDto} from './dto/CreateCanvasDto';
import {DeleteCanvasDto} from './dto/DeleteCanvasDto';
import {UpdateCanvasDto} from './dto/UpdateCanvasDto';

@Injectable()
export class CanvasService {
    constructor(
        public readonly canvasRepository: CanvasRepository,
        public readonly userToOrgRepository: UserToOrgRepository,
        public readonly categoryRepository: CategoryRepository,
        public readonly uploadImageRepository: UploadImageRepository,
        public readonly uploadImageService: UploadImageService,
    ) {}

    async isAdminOrEditor(userId: string, orgId: string) {
        const userToOrg = await this.userToOrgRepository
            .createQueryBuilder('userToOrg')
            .where('userToOrg.userId = :userId', { userId })
            .andWhere('userToOrg.orgId = :orgId', { orgId })
            .andWhere(
                'userToOrg.permission = :admin Or userToOrg.permission = :editor',
                { admin: PermissionEnum.ADMIN, editor: PermissionEnum.EDITOR },
            )
            .getOne();
        if (!userToOrg) {
            throw new UnauthorizedException();
        }
        return userToOrg;
    }

    async getById(id: string): Promise<CanvasInfoDto> {
        const canvas = await this.canvasRepository.findOne({
            where: {
                id,
            },
        });
        if (!canvas) {
            throw new NotFoundException();
        }
        const category = await this.categoryRepository.findOne({
            where: {
                id: canvas.categoryId,
            },
        });
        const image = await this.uploadImageRepository.findOne({
            where: {
                id: canvas.imageId,
            },
        });

        const canvasDto = canvas.toDto() as CanvasInfoDto;
        canvasDto.category = category?.toDto() || null;
        canvasDto.path = image?.path || '';
        return canvasDto;
    }

    async getByOrgId(orgId: string): Promise<CanvasInfoDto[]> {
        const listCanvasInfo = [];
        const canvases = await this.canvasRepository.find({
            where: {
                orgId,
            },
        });
        for (const canvas of canvases) {
            const category = await this.categoryRepository.findOne({
                where: {
                    id: canvas.categoryId,
                },
            });
            const image = await this.uploadImageRepository.findOne({
                where: {
                    id: canvas.imageId,
                },
            });

            const canvasDto = canvas.toDto() as CanvasInfoDto;
            canvasDto.category = category?.toDto() || null;
            canvasDto.path = image?.path || '';
            listCanvasInfo.push(canvasDto);
        }
        return listCanvasInfo;
    }

    async create(
        userId: string,
        createCanvasDto: CreateCanvasDto,
    ): Promise<CreateCanvasDto> {
        await this.isAdminOrEditor(userId, createCanvasDto.orgId);
        const canvasModel = new CanvasEntity();
        canvasModel.name = createCanvasDto.name;
        canvasModel.orgId = createCanvasDto.orgId;
        canvasModel.createdUserId = userId;
        canvasModel.data = createCanvasDto.data || '';
        canvasModel.categoryId = createCanvasDto.categoryId;
        canvasModel.imageId = createCanvasDto.imageId;

        const image = await this.uploadImageService.getImageById(
            createCanvasDto.imageId,
        );

        const canvasCreated = await this.canvasRepository.save(canvasModel);

        const canvasCreatedDto = canvasCreated.toDto() as CreateCanvasDto;
        // canvasCreatedDto.image = image.toDto();
        canvasCreatedDto.path = image?.path || '';
        canvasCreatedDto.categoryId = createCanvasDto.categoryId || '';
        canvasCreatedDto.imageId = createCanvasDto.imageId || '';
        return canvasCreatedDto;
    }

    async update(
        userId: string,
        updateCanvasDto: UpdateCanvasDto,
    ): Promise<UpdateCanvasDto> {
        await this.isAdminOrEditor(userId, updateCanvasDto.orgId);
        const canvas = await this.canvasRepository.findOne(updateCanvasDto.id);
        if (!canvas) {
            throw new NotFoundException();
        }
        canvas.name = updateCanvasDto.name || canvas.name;
        canvas.data = updateCanvasDto.data || canvas.data;
        canvas.categoryId = updateCanvasDto.categoryId || canvas.categoryId;
        canvas.imageId = updateCanvasDto.imageId || canvas.imageId;

        const image = await this.uploadImageService.getImageById(
            canvas.imageId,
        );

        const canvasUpdated = await this.canvasRepository.save(canvas);
        const canvasUpdatedDto = canvasUpdated.toDto() as UpdateCanvasDto;
        canvasUpdatedDto.path = image?.path || '';
        return canvasUpdatedDto;
    }

    async delete(
        userId: string,
        { canvasId, orgId }: DeleteCanvasDto,
    ): Promise<void> {
        await this.isAdminOrEditor(userId, orgId);
        await this.canvasRepository.delete(canvasId);
    }
}
