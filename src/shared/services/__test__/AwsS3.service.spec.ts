import {ConfigService} from '../config.service';
import {AwsS3Service} from "../aws-s3.service";
import {GeneratorService} from "../generator.service";
import {Test} from "@nestjs/testing";
import {mockConfigService, mockGeneratorService} from "../../__test__/base.service.specs";
import mock = jest.mock;

describe('AwsS3Service', () => {

    let awsS3Service: AwsS3Service;
    let configService;
    let generatorService;
    beforeEach(async () => {
        const module = await Test.createTestingModule({


            providers: [
                AwsS3Service, ConfigService,
               // {provide: ConfigService, useFactory: mockConfigService},
                {provide: GeneratorService, useFactory: mockGeneratorService},
            ],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
        mock("aws-sdk")
        generatorService = module.get<GeneratorService>(GeneratorService);
        awsS3Service = module.get<AwsS3Service>(AwsS3Service);

    });

    describe('uploadImage', () => {

        it('credential error', async () => {

            generatorService.fileName.mockReturnValue("test")
            jest.setTimeout(100000);
            try {
                let result = await awsS3Service.uploadImage({} as any)
            } catch (e) {


            }
        });
    });

});
