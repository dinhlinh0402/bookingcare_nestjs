import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from "class-validator";

export class UserChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @ApiProperty()
    currentPassword: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @ApiProperty()
    newPassword: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @ApiProperty()
    confirmPassword: string;
}

export class UserResetPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;
}