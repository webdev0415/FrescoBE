import { Injectable } from '@nestjs/common';
import { CanvasEntity } from './canvas.entity';
import { CanvasRepository } from './canvas.repository';
import { CreateCanvasDto } from './dto/CreateCanvasDto';

@Injectable()
export class CanvasService {
    constructor(
        public readonly canvasRepository: CanvasRepository,
    ) {}

    async get(orgId: string): Promise<CanvasEntity []> {
        return this.canvasRepository.find({
            where: {
                orgId,
            }
        });
    }

    async create(userId: string, createCanvasDto: CreateCanvasDto): Promise<CanvasEntity> {
        const canvasModel = new CanvasEntity();
        canvasModel.name = createCanvasDto.name;
        canvasModel.orgId = createCanvasDto.orgId;
        canvasModel.data = createCanvasDto.data || '';
        canvasModel.createdUserId = userId;

        const canvas = await this.canvasRepository.save(canvasModel);
        return canvas;
    }
}
