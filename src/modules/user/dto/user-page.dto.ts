import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, Min, MinLength, ValidateNested } from "class-validator";
import { GenderEnum } from "src/common/constants/gender";
import { RoleEnum } from "src/common/constants/role";
import { PageMetaDto } from "src/common/dto/page-meta.dto";
import { PageOptionsDto } from "src/common/dto/page-options.dto";
import { UserDto } from "./user.dto";

export class UsersPageDto {
    @ApiPropertyOptional({
        type: UserDto,
        isArray: true,
    })
    readonly data: UserDto[];

    @ApiPropertyOptional()
    readonly meta: PageMetaDto;

    constructor(data: UserDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}

export class UsersPageOptionsDto extends PageOptionsDto {
    @ApiPropertyOptional()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name: string;

    @ApiPropertyOptional({
        type: GenderEnum,
    })
    @IsEnum(GenderEnum)
    @IsNotEmpty()
    @IsOptional()
    gender: GenderEnum;

    @ApiPropertyOptional()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    birthPlace: string;

    @ApiPropertyOptional()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    nation: string;

    @ApiPropertyOptional()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    religion: string;

    @ApiPropertyOptional()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    address: string;

    @ApiPropertyOptional()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    phone: string;

    @ApiPropertyOptional()
    @IsDateString()
    @IsNotEmpty()
    @IsOptional()
    birthday: Date;

    @ApiPropertyOptional()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    email: string;

    @ApiPropertyOptional()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    identityCardNumber: string;

    @ApiPropertyOptional()
    @IsUUID('4')
    @IsNotEmpty()
    @IsOptional()
    clinicId: string;

    // @ApiPropertyOptional({
    //     type: String,
    //     enum: RoleEnum,
    //     required: false,
    //     description: 'Role'
    // })
    // @IsEnum(RoleEnum)
    // @IsOptional()
    // role: RoleEnum;

    @ApiPropertyOptional({
        required: false,
        description: 'Role'
    })
    @IsOptional()
    @IsArray()
    @IsEnum(RoleEnum, { each: true })
    // @ValidateNested({ each: true })
    // @IsString({ each: true })
    @Type(() => Role)
    @Transform(({ value }) => {
        return typeof value === 'string' ? [value] : value;
    })
    role: Role[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @IsBoolean({ each: true })
    @Type(() => String)
    @Transform(({ value }) => {
        const newValue = typeof value === 'string' ? [value] : value;
        return newValue.map(item => ['1', 1, 'true', true].includes(item))
    })
    status: boolean[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    @Type(() => String)
    @Transform(({ value }) => {
        return typeof value === 'string' ? [value] : value;
    })
    clinicIds: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    @Type(() => String)
    @Transform(({ value }) => {
        return typeof value === 'string' ? [value] : value;
    })
    specialtyIds: string[];
}

export class Role {
    @ApiPropertyOptional({
        // type: [Role],
        // enum: RoleEnum,
        required: false,
        description: 'Role'
    })
    @IsEnum(RoleEnum)
    @IsOptional()
    role1: RoleEnum;
}