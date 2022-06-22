import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SpecialtyCreateDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    image: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;
}

export class SpecialtyUpdateDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    image: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;
}