import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { PageMetaDto } from "src/common/dto/page-meta.dto";
import { PageOptionsDto } from "src/common/dto/page-options.dto";
import { SpecialtyDto } from "./specialty.dto";

export class SpecialtyPageDto {
    @ApiPropertyOptional({
        type: SpecialtyDto,
        isArray: true,
    })
    readonly data: SpecialtyDto[];

    @ApiPropertyOptional()
    readonly meta: PageMetaDto;

    constructor(data: SpecialtyDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}

export class SpecialtyPageOptionsDto extends PageOptionsDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    name: string;
}