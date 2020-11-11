import { Injectable } from '@nestjs/common';

import { UserToOrgRepository } from '../user-org/user-org.repository';
import { CategoryEntity } from './category.entity';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/CreateCategoryDto';
import { DeleteCategoryDto } from './dto/DeleteCategoryDto';
import { UpdateCategoryDto } from './dto/UpdateCategoryDto';

@Injectable()
export class CategoryService {
    constructor(
        public readonly categoryRepository: CategoryRepository,
        public readonly userToOrgRepository: UserToOrgRepository,
    ) {}

    getById(id: string): Promise<CategoryEntity> {
        return this.categoryRepository.findOne({
            where: {
                id,
            },
        });
    }

    getAll(): Promise<CategoryEntity[]> {
        return this.categoryRepository.find();
    }

    async create(
        createCategoryDto: CreateCategoryDto,
    ): Promise<CategoryEntity> {
        const categoryModel = new CategoryEntity();
        categoryModel.name = createCategoryDto.name;

        return this.categoryRepository.save(categoryModel);
    }

    async update(
        updateCategoryDto: UpdateCategoryDto,
    ): Promise<CategoryEntity> {
        const category = await this.categoryRepository.findOne(
            updateCategoryDto.id,
        );
        category.name = updateCategoryDto.name;
        return this.categoryRepository.save(category);
    }

    async delete({ categoryId }: DeleteCategoryDto): Promise<void> {
        await this.categoryRepository.delete(categoryId);
    }
}
