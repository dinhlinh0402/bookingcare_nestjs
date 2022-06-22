import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class ClinicCreateDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    address: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    phone: string;

    @IsEmail()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    email: string;

    // @IsString()
    // @IsNotEmpty()
    // @IsOptional()
    // @ApiPropertyOptional()
    // image: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    specialties: string;
}

export class ClinicUpdateDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    address: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    phone: string;

    @IsEmail()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    email: string;

    @IsBoolean()
    // @IsString()
    @IsOptional()
    @Transform(({ value }) => ['1', 1, 'true', true].includes(value))
    @ApiPropertyOptional()
    active: boolean;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    specialties: string;
}