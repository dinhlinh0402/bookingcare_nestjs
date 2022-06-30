import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsDateString, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { PageMetaDto } from "src/common/dto/page-meta.dto";
import { PageOptionsDto } from "src/common/dto/page-options.dto";
import { ScheduleDto } from "./schedule.dto";

export class SchedulePageDto {
    @ApiProperty({
        type: ScheduleDto,
        isArray: true,
    })
    readonly data: ScheduleDto[];

    @ApiProperty()
    readonly meta: PageMetaDto;

    constructor(data: ScheduleDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}

export class SchedulePageOptionsDto extends PageOptionsDto {
    @IsUUID('4')
    @IsNotEmpty()
    @ApiProperty()
    doctorId: string;

    // @IsDateString()
    // @IsNotEmpty()
    // @ApiProperty()
    // timeTo: Date;

    // @IsDateString()
    // @IsNotEmpty()
    // @ApiProperty()
    // timeFrom: Date;

    // Dùng cái này mới có thể set date
    @IsDate()
    // @IsOptional()
    @IsNotEmpty()
    @ApiProperty()
    @Transform(({ value }) => new Date(value))
    date: Date;
}