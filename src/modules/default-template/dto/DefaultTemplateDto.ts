'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/AbstractDto';
import { DefaultTemplateEntity } from '../default-template.entity';

export class DefaultTemplateDto extends AbstractDto {
    @ApiPropertyOptional()
    name: string;

    @ApiPropertyOptional()
    data: string;

    constructor(defaultTemplateEntity: DefaultTemplateEntity) {
        super(defaultTemplateEntity);
        this.name = defaultTemplateEntity.name;
        this.data = defaultTemplateEntity.data;
    }
}
