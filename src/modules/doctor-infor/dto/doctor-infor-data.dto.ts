import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { DoctorInforPayment, DoctorInforPosition } from "src/common/constants/doctor-infor.enum";

export class DoctorInforCreateDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    description: string;

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional()
    price: number;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    introduct: string;

    @IsEnum(DoctorInforPayment)
    @IsOptional()
    @ApiPropertyOptional()
    payment: DoctorInforPayment;

    @IsEnum(DoctorInforPosition)
    @IsOptional()
    @ApiPropertyOptional()
    position: DoctorInforPosition;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    note: string;

    @IsUUID('4')
    @IsNotEmpty()
    @ApiProperty()
    doctorId: string;

}

export class DoctorInforUpdateDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    description: string;

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional()
    price: number;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    introduct: string;

    @IsEnum(DoctorInforPayment)
    @IsOptional()
    @ApiPropertyOptional()
    payment: DoctorInforPayment;

    @IsEnum(DoctorInforPosition)
    @IsOptional()
    @ApiPropertyOptional()
    position: DoctorInforPosition;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    note: string;
}