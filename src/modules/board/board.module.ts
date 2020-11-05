import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardUserOrgRepository } from '../../modules/board-user-org/board-user-org.repository';
import { UserToOrgRepository } from '../../modules/user-org/user-org.repository';
import { BoardController } from './board.controller';
import { BoardRepository } from './board.repository';
import { BoardService } from './board.service';


@Module({
    imports: [
      TypeOrmModule.forFeature([UserToOrgRepository, BoardRepository, BoardUserOrgRepository]),
    ],
    controllers: [BoardController],
    providers: [BoardService],
    exports: [BoardService],
})
export class BoardModule {}
