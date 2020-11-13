import { Injectable } from '@nestjs/common';

import { CategoryRepository } from '../../modules/category/category.repository';
import { DefaultTemplateEntity } from './default-template.entity';
import { DefaultTemplateRepository } from './default-template.repository';
import { CreateDefaultTemplateDto } from './dto/CreateDefaultTemplateDto';
import { DefaultTemplateInfoDto } from './dto/DefaultTemplateInfoDto';
import { DeleteDefaultTemplateDto } from './dto/DeleteDefaultTemplateDto';
import { UpdateDefaultTemplateDto } from './dto/UpdateDefaultTemplateDto';

@Injectable()
export class DefaultTemplateService {
    constructor(
        public readonly defaultTemplateRepository: DefaultTemplateRepository,
        public readonly categoryRepository: CategoryRepository,
    ) {}

    async get(): Promise<DefaultTemplateInfoDto[]> {
        const listDefaultInfo = [];
        const defaultTemplates = await this.defaultTemplateRepository.find();
        for (const defaultTemplate of defaultTemplates) {
            const category = await this.categoryRepository.findOne({
                where: {
                    id: defaultTemplate.categoryId,
                },
            });
            listDefaultInfo.push({ ...defaultTemplate, category });
        }
        return listDefaultInfo;
    }

    async create(
        defaultTemplateDto: CreateDefaultTemplateDto,
    ): Promise<DefaultTemplateEntity> {
        const defaultTemplateModel = new DefaultTemplateEntity();
        defaultTemplateModel.name = defaultTemplateDto.name;
        defaultTemplateModel.data = defaultTemplateDto.data;
        defaultTemplateModel.categoryId = defaultTemplateDto.categoryId;
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
        defaultTemplate.categoryId = defaultTemplateDto.categoryId;
        return this.defaultTemplateRepository.save(defaultTemplate);
    }

    async delete({
        defaultTemplateId,
    }: DeleteDefaultTemplateDto): Promise<void> {
        await this.defaultTemplateRepository.delete(defaultTemplateId);
    }
}
