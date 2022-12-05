import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";
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

export class ClinicPageOptionsDto extends PageOptionsDto {
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
    @IsBoolean({ each: true })
    @IsArray()
    @IsOptional()
    @Type(() => String)
    @Transform(({ value }) => {
        const newValue = typeof value === 'string' ? [value] : value;
        return newValue.map(item => ['1', 1, 'true', true].includes(item))
    })
    active: boolean[];
}