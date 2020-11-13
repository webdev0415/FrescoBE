import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryRepository } from '../../modules/category/category.repository';
import { DefaultTemplateController } from './default-template.controller';
import { DefaultTemplateRepository } from './default-template.repository';
import { DefaultTemplateService } from './default-template.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            DefaultTemplateRepository,
            CategoryRepository,
        ]),
    ],
    controllers: [DefaultTemplateController],
    providers: [DefaultTemplateService],
    exports: [DefaultTemplateService],
})
export class DefaultTemplateModule {}
