import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DefaultTemplateController } from './default-template.controller';
import { DefaultTemplateRepository } from './default-template.repository';
import { DefaultTemplateService } from './default-template.service';

@Module({
    imports: [TypeOrmModule.forFeature([DefaultTemplateRepository])],
    controllers: [DefaultTemplateController],
    providers: [DefaultTemplateService],
    exports: [DefaultTemplateService],
})
export class DefaultTemplateModule {}
