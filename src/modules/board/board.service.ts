import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PermissionEnum } from '../../common/constants/permission';
import { UserToOrgRepository } from '../../modules/user-org/user-org.repository';
import { BoardEntity } from './board.entity';
import { BoardRepository } from './board.repository';
import { BoardDto } from './dto/BoardDto';
import { DeleteBoardDto } from './dto/DeleteBoardDto';

@Injectable()
export class BoardService {
    constructor(
        public readonly boardRepository: BoardRepository,
        public readonly userToOrgRepository: UserToOrgRepository,
    ) {}

    async isAdminOrEditor(userId: string, orgId: string) {
        const userToOrg = await this.userToOrgRepository.findOne({
            where: {
                userId,
                orgId,
                $and: [
                    { permission: PermissionEnum.ADMIN },
                    { permission: PermissionEnum.EDITOR },
                ],
            },
        });

        if (!userToOrg) {
            throw new UnauthorizedException();
        }
        return userToOrg;
    }

    async get(orgId: string): Promise<BoardEntity []> {
        return this.boardRepository.find({
            where: {
                orgId,
            }
        });
    }

    async create(userId: string, boardDto: BoardDto): Promise<BoardEntity> {
        await this.isAdminOrEditor(userId, boardDto.orgId);

        const boardModel = new BoardEntity();
        boardModel.name = boardDto.name;
        boardModel.orgId = boardDto.orgId;
        boardModel.data = boardDto.data;
        boardModel.createdUserId = userId;
        return this.boardRepository.save(boardModel);
    }

    async update(userId: string, boardDto: BoardDto): Promise<BoardEntity> {
        await this.isAdminOrEditor(userId, boardDto.orgId);
        return this.boardRepository.save(boardDto);
    }

    async delete({boardId, userId, orgId}: DeleteBoardDto): Promise<void> {
        await this.isAdminOrEditor(userId, orgId);
        await this.boardRepository.delete(boardId);
    }
}
