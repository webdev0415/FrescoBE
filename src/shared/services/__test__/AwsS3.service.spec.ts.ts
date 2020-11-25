import {ConfigService} from '../config.service';
import {AwsS3Service} from "../aws-s3.service";
import {GeneratorService} from "../generator.service";
import {Test} from "@nestjs/testing";
import {mockConfigService, mockGeneratorService} from "../../../__test__/base.service.specs";

describe('ConfigService', () => {

    let awsS3Service: AwsS3Service;
    let configService;
    let generatorService;
    beforeEach(async () => {
        const module = await Test.createTestingModule({


            providers: [
                AwsS3Service,
                {provide: ConfigService, useFactory: mockConfigService},
                {provide: GeneratorService, useFactory: mockGeneratorService},
            ],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);

        configService.awsS3Config.mockReturnValue({accessKeyId:"",secretAccessKey:""})

        generatorService = module.get<GeneratorService>(GeneratorService);
        awsS3Service = module.get<AwsS3Service>(AwsS3Service);

    });


});
