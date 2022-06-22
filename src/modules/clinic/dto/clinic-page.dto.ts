import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";
import { PageMetaDto } from "src/common/dto/page-meta.dto";
import { PageOptionsDto } from "src/common/dto/page-options.dto";
import { ClinicDto } from "./clinic.dto";

export class ClinicPageDto {
    @ApiProperty({
        type: ClinicDto,
        isArray: true
    })
    readonly data: ClinicDto[];

    @ApiProperty()
    readonly meta: PageMetaDto;

    constructor(data: ClinicDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}

export class ClinicPageOptinonsDto extends PageOptionsDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    name: string;

    @IsEmail()
    @IsOptional()
    @ApiPropertyOptional()
    email: string

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    phone: string

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => ['1', 1, 'true', true].includes(value))
    active: boolean;
}