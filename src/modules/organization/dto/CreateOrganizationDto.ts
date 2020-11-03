import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrganizationDto {
    @IsString()
    @IsNotEmpty()
    @ApiPropertyOptional()
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiPropertyOptional()
    fName: string;

    @IsString()
    @IsNotEmpty()
    @ApiPropertyOptional()
    lName: string;
}
