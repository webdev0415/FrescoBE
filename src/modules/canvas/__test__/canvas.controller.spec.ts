/* eslint-disable @typescript-eslint/no-unused-vars */
import {

    CacheModule,

} from '@nestjs/common';
import { Test } from '@nestjs/testing';


import {CanvasController} from "../canvas.controller";
import {CanvasService} from "../canvas.service";
import {userEntity} from "../../auth/__test__/auth.controller.spec";
import {CreateCanvasDto} from "../../Canvas/dto/CreateCanvasDto";
import {UpdateCanvasDto} from "../../Canvas/dto/UpdateCanvasDto";
import {mockCanvasService} from "../../__test__/base.service.specs";
import {mockCanvasEntity} from "../../Canvas/__test__/Canvas.service.spec";

import {DeleteCanvasDto} from "../../Canvas/dto/DeleteCanvasDto";

const mockCache = () => ({});

describe('CanvasController', () => {
    let canvasController: CanvasController;
    let canvasService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({

            providers: [
                CanvasController

                ,
                { provide: CanvasService, useFactory: mockCanvasService },
            ],
        }).compile();

        canvasController = module.get<CanvasController>(CanvasController);
        canvasService = module.get<CanvasService>(CanvasService);

    });


    describe('get list Canvas by Canvas id',  () => {
        it('should return Canvas entity', async() => {
            canvasService.getById.mockResolvedValue(mockCanvasEntity);
            let result=await canvasController.getCanvas("id");
            expect(result).toEqual(mockCanvasEntity);
        });
    });

    describe('get list Canvas by orgId',  () => {
        it('should return Canvas entity list', async() => {
            canvasService.getByOrgId.mockResolvedValue([mockCanvasEntity]);
            let result=await canvasController.get("id");
            expect(result).toHaveLength(1)
        });
    });

    describe('create Canvas',  () => {
        it('should return createCanvasDto', async() => {
            let createCanvasDto:CreateCanvasDto=new  CreateCanvasDto();

            canvasService.create.mockResolvedValue(createCanvasDto);
            let result=await canvasController.create(userEntity,createCanvasDto);
            expect(result).toEqual(createCanvasDto)
        });
    });
    describe('update Canvas',  () => {
        it('should return CanvasDto', async() => {
            let createCanvasDto:UpdateCanvasDto=new  UpdateCanvasDto();

            canvasService.update.mockResolvedValue(mockCanvasEntity);
            let result=await canvasController.update(userEntity,"",createCanvasDto);
            expect(result).toEqual(mockCanvasEntity)
        });
    });
    describe('delete Canvas',  () => {
        it('should return void', async() => {

            canvasService.delete.mockResolvedValue(mockCanvasEntity);
            let result=await canvasController.delete(userEntity,"",new DeleteCanvasDto());
            expect(result).toBeFalsy()

        });
    });


});
