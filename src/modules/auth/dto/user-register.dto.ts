import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";
import { GenderEnum } from "src/common/constants/gender";

export class UserRegisterDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    middleName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @ApiProperty({ minLength: 6 })
    password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @ApiProperty({ minLength: 6 })
    confirmPassword: string;
}