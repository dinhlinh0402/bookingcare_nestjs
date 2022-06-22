import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
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

    @ApiPropertyOptional({
        type: String,
        enum: RoleEnum,
        required: false,
        description: 'Role'
    })
    @IsEnum(RoleEnum)
    @IsOptional()
    role: RoleEnum;
}