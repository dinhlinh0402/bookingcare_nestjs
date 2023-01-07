import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID } from "class-validator";
import { BookingStatus, BookingType } from "src/common/constants/booking.enum";
import { GenderEnum } from "src/common/constants/gender";

export class BookingCreateDto {
    @IsUUID('4')
    @IsNotEmpty()
    @ApiProperty()
    doctorId: string;

    // @IsUUID('4')
    // @IsNotEmpty()
    // @ApiProperty()
    // patientId: string;

    @IsUUID('4')
    @IsNotEmpty()
    @ApiProperty()
    scheduleId: string;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    date: Date;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    bookingDate: Date;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    reason: string;

    @IsEnum(BookingType)
    @IsNotEmpty()
    @ApiProperty({ enum: BookingType, default: BookingType.FOR_MYSELF })
    type: BookingType;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    name: string;

    @IsEmail()
    @IsOptional()
    @ApiPropertyOptional()
    email: string;

    @IsPhoneNumber('VN')
    @IsOptional()
    @ApiPropertyOptional()
    phone: string;

    @IsEnum(GenderEnum)
    @IsOptional()
    @ApiPropertyOptional({ enum: GenderEnum })
    gender: GenderEnum;

    @IsDateString()
    @IsOptional()
    @ApiPropertyOptional()
    birthday: Date;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    address: string;
}

export class BookingUpdateDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    reason: string;


    @IsEnum(BookingStatus)
    @IsOptional()
    @ApiPropertyOptional({ enum: BookingStatus })
    status: BookingStatus;

    @IsEnum(BookingType)
    @IsOptional()
    @ApiProperty({ enum: BookingType })
    type: BookingType;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    name: string;

    @IsEmail()
    @IsOptional()
    @ApiPropertyOptional()
    email: string;

    @IsPhoneNumber('VN')
    @IsOptional()
    @ApiPropertyOptional()
    phone: string;

    @IsEnum(GenderEnum)
    @IsOptional()
    @ApiPropertyOptional()
    gender: GenderEnum;

    @IsDateString()
    @IsOptional()
    @ApiPropertyOptional()
    birthday: Date;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    address: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    userNote: string;
}

export class ConfirmBookingDto {
    @IsUUID('4')
    @IsNotEmpty()
    @ApiProperty()
    doctorId: string;

    @IsUUID('4')
    @IsNotEmpty()
    @ApiProperty()
    token: string;
}