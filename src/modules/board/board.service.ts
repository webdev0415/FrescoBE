import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BoardUserOrgRepository } from '../../modules/board-user-org/board-user-org.repository';
import { PermissionEnum } from '../../common/constants/permission';
import { UserToOrgRepository } from '../../modules/user-org/user-org.repository';
import { BoardEntity } from './board.entity';
import { BoardRepository } from './board.repository';
import { DeleteBoardDto } from './dto/DeleteBoardDto';
import { BoardUserOrgEntity } from '../../modules/board-user-org/board-user-org.entity';
import { CreateBoardDto } from './dto/CreateBoardDto';
import { UpdateBoardDto } from './dto/UpdateBoardDto';

@Injectable()
export class BoardService {
    constructor(
        public readonly boardRepository: BoardRepository,
        public readonly userToOrgRepository: UserToOrgRepository,
        public readonly boardUserOrgRepository: BoardUserOrgRepository,
    ) {}

    async isAdminOrEditor(userId: string, orgId: string) {
        const userToOrg = await this.userToOrgRepository
            .createQueryBuilder('userToOrg')
            .where('userToOrg.userId = :userId', { userId })
            .andWhere('userToOrg.orgId = :orgId', { orgId })
            .andWhere(
                'userToOrg.permission = :admin Or userToOrg.permission = :editor',
                { admin: PermissionEnum.ADMIN, editor: PermissionEnum.EDITOR },
            )
            .getOne();
        // const userToOrg = await this.userToOrgRepository.find({
        //     where: {
        //         userId,
        //         orgId,
        //         and: [
        //             { permission: PermissionEnum.ADMIN },
        //             { permission: PermissionEnum.EDITOR },
        //         ],
        //     },
        // });

        if (!userToOrg) {
            throw new UnauthorizedException();
        }
        return userToOrg;
    }

    async getById(id: string): Promise<BoardEntity> {
        return this.boardRepository.findOne({
            where: {
                id,
            },
        });
    }

    async getByOrgId(orgId: string): Promise<BoardEntity[]> {
        return this.boardRepository.find({
            where: {
                orgId,
            },
        });
    }

    async create(
        userId: string,
        createBoardDto: CreateBoardDto,
    ): Promise<BoardEntity> {
        await this.isAdminOrEditor(userId, createBoardDto.orgId);

        const boardModel = new BoardEntity();
        boardModel.name = createBoardDto.name;
        boardModel.orgId = createBoardDto.orgId;
        boardModel.data = createBoardDto.data || '';
        boardModel.createdUserId = userId;

        const board = await this.boardRepository.save(boardModel);

        const boardUserOrgModel = new BoardUserOrgEntity();
        boardUserOrgModel.boardId = board.id;
        boardUserOrgModel.orgId = board.orgId;
        boardUserOrgModel.userId = board.createdUserId;
        await this.boardUserOrgRepository.save(boardUserOrgModel);

        return board;
    }

    async update(
        userId: string,
        updateBoardDto: UpdateBoardDto,
    ): Promise<BoardEntity> {
        await this.isAdminOrEditor(userId, updateBoardDto.orgId);
        const board = await this.boardRepository.findOne(updateBoardDto.id);
        board.name = updateBoardDto.name;
        board.data = updateBoardDto.data;
        return this.boardRepository.save(board);
    }

    async delete({ boardId, userId, orgId }: DeleteBoardDto): Promise<void> {
        await this.isAdminOrEditor(userId, orgId);
        await this.boardUserOrgRepository.delete({
            userId,
            boardId,
            orgId,
        });
        await this.boardRepository.delete(boardId);
    }
}
