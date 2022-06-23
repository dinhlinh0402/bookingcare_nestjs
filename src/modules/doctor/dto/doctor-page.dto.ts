import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsOptional, IsString, IsUUID } from "class-validator";
import { PageMetaDto } from "src/common/dto/page-meta.dto";
import { PageOptionsDto } from "src/common/dto/page-options.dto";
import { DoctorDto } from "./doctor.dto";

export class DoctorPageDto {
    @ApiProperty({
        type: DoctorDto,
        isArray: true
    })
    readonly data: DoctorDto[];

    @ApiProperty()
    readonly meta: PageMetaDto;

    constructor(data: DoctorDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}

export class DoctorPageOptionsDto extends PageOptionsDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    name: string;

    @IsEmail()
    @IsOptional()
    @ApiPropertyOptional()
    email: string;

    @IsUUID('4')
    @IsOptional()
    @ApiPropertyOptional()
    clinicId: string;

    @IsUUID('4')
    @IsOptional()
    @ApiPropertyOptional()
    specialtyId: string;

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => ['1', 'true', 1, true].includes(value))
    @ApiPropertyOptional({ default: true })
    topDoctor: boolean;
}