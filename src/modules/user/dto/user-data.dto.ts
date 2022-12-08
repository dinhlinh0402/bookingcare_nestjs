import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsDateString, IsEmail, IsEmpty, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID, Min, MinLength } from "class-validator";
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
    @IsEmpty()
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
    @IsEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    birthday: Date;

    @IsString()
    @IsEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    address: string;

    @IsPhoneNumber('VN')
    @IsString()
    @IsEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    phoneNumber: string;

    @IsUUID('4')
    @IsEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    clinicId: string;

    @IsUUID('4')
    @IsEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    specialtyId: string;

}

export class UserUpdateDto {
    @IsString()
    @IsEmail()
    @IsEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    email: string;

    @IsString()
    @IsEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    firstName: string;

    @IsString()
    @IsEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    middleName: string;

    @IsString()
    @IsEmpty()
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
    @IsEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    birthday: Date;

    @IsString()
    @IsEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    address: string;

    @IsPhoneNumber('VN')
    @IsEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    phoneNumber: string;

    @IsUUID('4')
    @IsEmpty()
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
    @ApiProperty()
    userIds: string[];
}

export class UserDelete {
    @IsUUID('4', { each: true })
    @IsArray()
    @ArrayMinSize(1)
    @IsNotEmpty()
    @Type(() => String)
    @ApiProperty()
    userIds: string[];
}