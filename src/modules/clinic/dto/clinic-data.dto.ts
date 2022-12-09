import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID } from "class-validator";

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

    @IsPhoneNumber('VN')
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

    // Do gửi dưới dạng form data nên phỉa gửi array dưới dạng string rồi parse sang array
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

    @IsPhoneNumber('VN')
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

export class ClinicDelete {
    @IsUUID('4', { each: true })
    @IsArray()
    @ArrayMinSize(1)
    @IsNotEmpty()
    @Type(() => String)
    @ApiProperty()
    clinicIds: string[];
}

export class ClinicChangeActive {
    @IsBoolean()
    @IsNotEmpty()
    @Transform(({ value }) => [1, '1', true, 'true'].includes(value))
    @ApiProperty()
    active: boolean;

    @IsUUID('4', { each: true })
    @IsArray()
    @ArrayMinSize(1)
    @IsNotEmpty()
    @Type(() => String)
    @ApiProperty()
    clinicIds: string[];
}