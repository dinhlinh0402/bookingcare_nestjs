import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID, Min, MinLength } from "class-validator";
import { GenderEnum } from "src/common/constants/gender";
import { RoleEnum } from "src/common/constants/role";

export class UserCreateDto {
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
    @IsOptional()
    @ApiPropertyOptional()
    middleName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(GenderEnum)
    @ApiProperty({ enum: GenderEnum })
    gender: GenderEnum;

    @IsEnum(RoleEnum)
    @IsOptional()
    @ApiPropertyOptional({
        enum: RoleEnum,
        default: RoleEnum.USER,
    })
    role: RoleEnum;

    @IsDateString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    birthday: Date;

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
    phoneNumber: string;

    @IsUUID('4')
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    clinicId: string;

    @IsUUID('4')
    @IsOptional()
    @ApiPropertyOptional()
    specialtyId: string;

}

export class UserUpdateDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    email: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    middleName: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    lastName: string;

    @IsString()
    @IsEnum(GenderEnum)
    @IsOptional()
    @ApiPropertyOptional()
    gender: GenderEnum;

    @IsEnum(RoleEnum)
    @IsOptional()
    @ApiPropertyOptional({
        enum: RoleEnum,
        default: RoleEnum.USER,
    })
    role: RoleEnum;

    @IsDateString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    birthday: Date;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    address: string;

    @IsPhoneNumber('VN')
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    phoneNumber: string;

    @IsUUID('4')
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    clinicId: string;

    @IsUUID('4')
    @IsOptional()
    @ApiPropertyOptional()
    specialtyId: string;
}

export class UserUpdateStatus {
    @IsBoolean()
    @ApiProperty()
    @IsNotEmpty()
    @Transform(({ value }) => ['1', 1, 'true', true].includes(value))
    status: boolean;

    @IsUUID('4', { each: true })
    @IsArray()
    @ArrayMinSize(1)
    @IsNotEmpty()
    @Type(() => String)
    userIds: string[];
}

export class UserDelete {
    @IsUUID('4', { each: true })
    @IsArray()
    @ArrayMinSize(1)
    @IsNotEmpty()
    @Type(() => String)
    userIds: string[];
}