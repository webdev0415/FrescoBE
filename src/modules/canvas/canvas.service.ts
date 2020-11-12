import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PermissionEnum } from '../../common/constants/permission';
import { CategoryRepository } from '../../modules/category/category.repository';
import { UserToOrgRepository } from '../../modules/user-org/user-org.repository';
import { CanvasEntity } from './canvas.entity';
import { CanvasRepository } from './canvas.repository';
import { CanvasInfoDto } from './dto/CanvasInfoDto';
import { CreateCanvasDto } from './dto/CreateCanvasDto';
import { DeleteCanvasDto } from './dto/DeleteCanvasDto';
import { UpdateCanvasDto } from './dto/UpdateCanvasDto';

@Injectable()
export class CanvasService {
    constructor(
        public readonly canvasRepository: CanvasRepository,
        public readonly userToOrgRepository: UserToOrgRepository,
        public readonly categoryRepository: CategoryRepository,
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
        const category = await this.categoryRepository.findOne({
            where: {
                id: canvas.categoryId,
            },
        });
        return { ...canvas, category };
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
            listCanvasInfo.push({ ...canvas, category });
        }
        return listCanvasInfo;
    }

    async create(
        userId: string,
        createCanvasDto: CreateCanvasDto,
    ): Promise<CanvasEntity> {
        await this.isAdminOrEditor(userId, createCanvasDto.orgId);
        const canvasModel = new CanvasEntity();
        canvasModel.name = createCanvasDto.name;
        canvasModel.orgId = createCanvasDto.orgId;
        canvasModel.createdUserId = userId;
        canvasModel.data = createCanvasDto.data || '';
        canvasModel.categoryId = createCanvasDto.categoryId;
        canvasModel.image = createCanvasDto.image;

        return this.canvasRepository.save(canvasModel);
    }

    async update(
        userId: string,
        updateCanvasDto: UpdateCanvasDto,
    ): Promise<CanvasEntity> {
        await this.isAdminOrEditor(userId, updateCanvasDto.orgId);
        const canvas = await this.canvasRepository.findOne(updateCanvasDto.id);
        canvas.name = updateCanvasDto.name;
        canvas.data = updateCanvasDto.data;
        return this.canvasRepository.save(canvas);
    }

    async delete(
        userId: string,
        { canvasId, orgId }: DeleteCanvasDto,
    ): Promise<void> {
        await this.isAdminOrEditor(userId, orgId);
        await this.canvasRepository.delete(canvasId);
    }
}
