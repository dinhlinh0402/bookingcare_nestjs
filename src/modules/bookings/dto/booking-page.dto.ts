import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { isArray, IsArray, IsDate, IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
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

    // @IsEnum(BookingStatus)
    // @IsOptional()
    // @ApiPropertyOptional({ type: BookingStatus })
    // status: BookingStatus;

    @IsDate()
    @IsOptional()
    @ApiPropertyOptional()
    @Transform(({ value }) => new Date(value))
    date: Date;

    @IsOptional()
    @IsArray()
    @IsEnum(BookingStatus, { each: true })
    @Type(() => Status)
    @Transform(({ value }) => {
        return typeof value === 'string' ? [value] : value;
    })
    @ApiPropertyOptional({
        required: false,
        description: 'List status'
    })
    status: Status[];
}

export class Status {
    @ApiPropertyOptional({
        // type: [Role],
        // enum: RoleEnum,
        required: false,
        description: 'BookingStatus'
    })
    @IsEnum(BookingStatus)
    @IsOptional()
    status: BookingStatus;
}

export class BookingsByClinicDto {
    @IsUUID('4')
    @IsNotEmpty()
    @ApiProperty()
    clinicId: string;
}

class WaitingDto {
    @ApiPropertyOptional({ type: () => BookingDto, isArray: true })
    dataWaiting: BookingDto[];

    @ApiPropertyOptional()
    totalWaiting: number;
}

class ConfirmedDto {
    @ApiPropertyOptional({ type: () => BookingDto, isArray: true })
    dataConfirmed: BookingDto[];

    @ApiPropertyOptional()
    totalConfirmed: number;
}

class CancelDto {
    @ApiPropertyOptional({ type: () => BookingDto, isArray: true })
    dataCancel: BookingDto[];

    @ApiPropertyOptional()
    totalCancel: number;
}

class DoneDto {
    @ApiPropertyOptional({ type: () => BookingDto, isArray: true })
    dataDone: BookingDto[];

    @ApiPropertyOptional()
    totalDone: number;
}


export class BookingsByClinicResDto {
    @ApiProperty({
        type: WaitingDto,
        // isArray: true,
    })
    readonly waiting: WaitingDto;

    @ApiProperty({
        type: ConfirmedDto,
        // isArray: true,
    })
    readonly confirmed: ConfirmedDto;

    @ApiProperty({
        type: CancelDto,
        // isArray: true,
    })
    readonly cancel: CancelDto;

    @ApiProperty({
        type: DoneDto,
        // isArray: true,
    })
    readonly done: DoneDto;

    constructor(waiting: WaitingDto, confirmed: ConfirmedDto, cancel: CancelDto, done: DoneDto) {
        this.waiting = waiting;
        this.confirmed = confirmed;
        this.cancel = cancel;
        this.done = done;
        // this.meta = meta;
    }
}