import { ApiPropertyOptional } from "@nestjs/swagger";
import { AbstractDto } from "src/common/dto/abstract.dto";
import { SpecialtyDto } from "src/modules/specialty/dto/specialty.dto";
import { UserDto } from "src/modules/user/dto/user.dto";
import { ClinicInforDto } from "../clinic-infor/dto/clinic-infor.dto";
import { ClinicEntity } from "../clinic.entity";

export class ClinicDto extends AbstractDto {
    @ApiPropertyOptional()
    name: string;

    @ApiPropertyOptional()
    address: string;

    @ApiPropertyOptional()
    phone: string;

    @ApiPropertyOptional()
    email: string;

    @ApiPropertyOptional()
    active: boolean;

    @ApiPropertyOptional()
    province: string;

    @ApiPropertyOptional()
    image: string;

    @ApiPropertyOptional({ type: () => ClinicInforDto })
    clinicInfor: ClinicInforDto;

    @ApiPropertyOptional({ type: () => [SpecialtyDto] })
    specialties: SpecialtyDto[];

    @ApiPropertyOptional({ type: () => UserDto })
    creator: UserDto;

    constructor(entity: ClinicEntity) {
        super(entity);

        this.name = entity.name;
        this.address = entity.address;
        this.phone = entity.phone;
        this.email = entity.email;
        this.active = entity.active;
        this.province = entity.province;
        this.image = entity.image;

        if (entity.creator) {
            this.creator = entity.creator;
        }
        if (entity.clinicInfor) {
            this.clinicInfor = entity.clinicInfor;
        }

        if (entity.specialties) {
            this.specialties = entity.specialties.toDtos();
        }
    }
}