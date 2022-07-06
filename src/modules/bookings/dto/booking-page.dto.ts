import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsOptional, IsUUID } from "class-validator";
import { BookingStatus } from "src/common/constants/booking.enum";
import { PageMetaDto } from "src/common/dto/page-meta.dto";
import { PageOptionsDto } from "src/common/dto/page-options.dto";
import { BookingDto } from "./booking.dto";

export class BookingPageDto {
    @ApiProperty({
        type: BookingDto,
        isArray: true,
    })
    readonly data: BookingDto[];

    @ApiProperty()
    readonly meta: PageMetaDto;

    constructor(data: BookingDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}

export class BookingPageOptionsDto extends PageOptionsDto {
    @IsUUID('4')
    @IsOptional()
    @ApiPropertyOptional()
    patientId: string;

    @IsUUID('4')
    @IsOptional()
    @ApiPropertyOptional()
    doctorId: string;

    @IsEnum(BookingStatus)
    @IsOptional()
    @ApiPropertyOptional({ type: BookingStatus })
    status: BookingStatus;

    @IsDate()
    @IsOptional()
    @ApiPropertyOptional()
    @Transform(({ value }) => new Date(value))
    date: Date;
}