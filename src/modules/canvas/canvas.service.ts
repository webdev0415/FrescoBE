import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PermissionEnum } from '../../common/constants/permission';
import { UserToOrgRepository } from '../../modules/user-org/user-org.repository';
import { CanvasEntity } from './canvas.entity';
import { CanvasRepository } from './canvas.repository';
import { CreateCanvasDto } from './dto/CreateCanvasDto';
import { DeleteCanvasDto } from './dto/DeleteCanvasDto';
import { UpdateCanvasDto } from './dto/UpdateCanvasDto';

@Injectable()
export class CanvasService {
    constructor(
        public readonly canvasRepository: CanvasRepository,
        public readonly userToOrgRepository: UserToOrgRepository,
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

    async get(orgId: string): Promise<CanvasEntity[]> {
        return this.canvasRepository.find({
            where: {
                orgId,
            },
        });
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
