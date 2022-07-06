import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { BookingStatus } from "src/common/constants/booking.enum";

export class BookingCreateDto {
    @IsUUID('4')
    @IsNotEmpty()
    @ApiProperty()
    doctorId: string;

    @IsUUID('4')
    @IsNotEmpty()
    @ApiProperty()
    patientId: string;

    @IsUUID('4')
    @IsNotEmpty()
    @ApiProperty()
    scheduleId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    reason: string;
}

export class BookingUpdateDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    reason: string;

    @IsEnum(BookingStatus)
    @IsOptional()
    @ApiPropertyOptional({ type: BookingStatus })
    status: BookingStatus;
}