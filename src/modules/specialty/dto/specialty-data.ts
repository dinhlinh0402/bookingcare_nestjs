import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class SpecialtyCreateDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;
}

export class SpecialtyUpdateDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    name: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    description: string;
}

export class SpecialtyDelete {
    @IsUUID('4', { each: true })
    @IsArray()
    @ArrayMinSize(1)
    @IsNotEmpty()
    @Type(() => String)
    @ApiProperty()
    specialtyIds: string[];
}