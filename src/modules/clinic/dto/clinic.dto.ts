import { ApiPropertyOptional } from "@nestjs/swagger";
import { AbstractDto } from "src/common/dto/abstract.dto";
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

    @ApiPropertyOptional({ type: () => ClinicInforDto })
    clinicInfor: ClinicInforDto;

    @ApiPropertyOptional({ type: () => UserDto })
    creator: UserDto;

    constructor(entity: ClinicEntity) {
        super(entity);

        this.name = entity.name;
        this.address = entity.address;
        this.phone = entity.phone;
        this.email = entity.email;
        this.active = entity.active;

        if (entity.creator) {
            this.creator = entity.creator;
        }
        if (entity.clinicInfor) {
            this.clinicInfor = entity.clinicInfor;
        }
    }
}