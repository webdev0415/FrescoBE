import { Injectable } from '@nestjs/common';

import { DefaultTemplateEntity } from './default-template.entity';
import { DefaultTemplateRepository } from './default-template.repository';
import { CreateDefaultTemplateDto } from './dto/CreateDefaultTemplateDto';
import { DeleteDefaultTemplateDto } from './dto/DeleteDefaultTemplateDto';
import { UpdateDefaultTemplateDto } from './dto/UpdateDefaultTemplateDto';

@Injectable()
export class DefaultTemplateService {
    constructor(
        public readonly defaultTemplateRepository: DefaultTemplateRepository,
    ) {}

    async get(): Promise<DefaultTemplateEntity[]> {
        return this.defaultTemplateRepository.find();
    }

    async create(
        defaultTemplateDto: CreateDefaultTemplateDto,
    ): Promise<DefaultTemplateEntity> {
        const defaultTemplateModel = new DefaultTemplateEntity();
        defaultTemplateModel.name = defaultTemplateDto.name;
        defaultTemplateModel.data = defaultTemplateDto.data;
        return this.defaultTemplateRepository.save(defaultTemplateModel);
    }

    async update(
        defaultTemplateDto: UpdateDefaultTemplateDto,
    ): Promise<DefaultTemplateEntity> {
        const defaultTemplate = await this.defaultTemplateRepository.findOne(
            defaultTemplateDto.id,
        );
        defaultTemplate.name = defaultTemplateDto.name;
        defaultTemplate.data = defaultTemplateDto.data;
        return this.defaultTemplateRepository.save(defaultTemplate);
    }

    async delete({
        defaultTemplateId,
    }: DeleteDefaultTemplateDto): Promise<void> {
        await this.defaultTemplateRepository.delete(defaultTemplateId);
    }
}
