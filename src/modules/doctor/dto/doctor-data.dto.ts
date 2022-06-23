import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { RoleEnum } from "src/common/constants/role";
import { UserCreateDto } from "src/modules/user/dto/user-data.dto";

export class DoctorCreateDto extends UserCreateDto {
    @IsEnum(RoleEnum)
    @IsOptional()
    @ApiPropertyOptional({
        enum: RoleEnum,
        default: RoleEnum.DOCTOR,
    })
    role: RoleEnum;
}