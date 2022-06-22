import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class ClinicInforCreateDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    introduct: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    strengths: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    equipment: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    location: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    procedure: string;

    @IsUUID('4')
    @IsNotEmpty()
    @ApiProperty()
    clinicId: string;
}

export class ClinicInforUpdateDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    introduct: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    strengths: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    equipment: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    location: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    procedure: string;
}
