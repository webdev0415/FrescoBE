/* eslint-disable @typescript-eslint/no-unused-vars */
import {Test} from '@nestjs/testing';

import {BoardService} from "../board.service";
import {BoardController} from "../board.controller";
import {mockBoardEntity} from "./board.service.spec";
import {CreateBoardDto} from "../dto/CreateBoardDto";
import {userEntity} from "../../auth/__test__/auth.controller.spec";
import {UpdateBoardDto} from "../dto/UpdateBoardDto";
import {DeleteBoardDto} from "../dto/DeleteBoardDto";
import {mockBoardService} from "../../__test__/base.service.specs";

const mockCache = () => ({});

describe('BoardController', () => {
    let boardController: BoardController;
    let boardService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({

            providers: [
                BoardController,
                { provide: BoardService, useFactory: mockBoardService },
            ],
        }).compile();

        boardController = module.get<BoardController>(BoardController);
        boardService = module.get<BoardService>(BoardService);

    });


    describe('get list board by board id',  () => {
        it('should return board entity', async() => {
            boardService.getById.mockResolvedValue(mockBoardEntity);
            let result=await boardController.getById("id");
            expect(result).toEqual(mockBoardEntity);
        });
    });

    describe('get list board by orgId',  () => {
        it('should return board entity list', async() => {
            boardService.getByOrgId.mockResolvedValue([mockBoardEntity]);
            let result=await boardController.getByOrgId("id");
            expect(result).toHaveLength(1)
        });
    });

    describe('create board',  () => {
        it('should return createBoardDto', async() => {
            let createBoardDto:CreateBoardDto=new  CreateBoardDto();

            boardService.create.mockResolvedValue(createBoardDto);
            let result=await boardController.create(userEntity,createBoardDto);
            expect(result).toEqual(createBoardDto)
        });
    });
    describe('update board',  () => {
        it('should return BoardDto', async() => {
            let createBoardDto:UpdateBoardDto=new  UpdateBoardDto();

            boardService.update.mockResolvedValue(mockBoardEntity);
            let result=await boardController.update(userEntity,"",createBoardDto);
            expect(result).toEqual(mockBoardEntity)
        });
    });
    describe('delete board',  () => {
        it('should return void', async() => {

            boardService.delete.mockResolvedValue(mockBoardEntity);
            let result=await boardController.delete(userEntity,new DeleteBoardDto(),"");
            expect(result).toBeFalsy()

        });
    });


});
