import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BoardUserOrgRepository } from '../../modules/board-user-org/board-user-org.repository';
import { CategoryRepository } from '../../modules/category/category.repository';
import { UploadImageRepository } from '../../modules/upload/upload-image.repository';
import { UserToOrgRepository } from '../../modules/user-org/user-org.repository';
import { BoardController } from './board.controller';
import { BoardRepository } from './board.repository';
import { BoardService } from './board.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserToOrgRepository,
            BoardRepository,
            BoardUserOrgRepository,
            UploadImageRepository,
            CategoryRepository,
        ]),
    ],
    controllers: [BoardController],
    providers: [BoardService],
    exports: [BoardService],
})
export class BoardModule {}
