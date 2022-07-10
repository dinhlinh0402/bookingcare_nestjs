import { ApiPropertyOptional } from "@nestjs/swagger";
import { AbstractDto } from "src/common/dto/abstract.dto";
import { UserDto } from "src/modules/user/dto/user.dto";
import { UserEntity } from "src/modules/user/user.entity";
import { ClinicEntity } from "../../clinic.entity";
import { ClinicDto } from "../../dto/clinic.dto";
import { ClinicInforEntity } from "../clinic-infor.entity";


export class ClinicInforDto extends AbstractDto {
    @ApiPropertyOptional()
    introduct: string;

    @ApiPropertyOptional()
    strengths: string;

    @ApiPropertyOptional()
    equipment: string;

    @ApiPropertyOptional()
    location: string;

    @ApiPropertyOptional()
    procedure: string;

    @ApiPropertyOptional({ type: () => ClinicDto })
    clinic: ClinicDto;

    // @ApiPropertyOptional()
    // clinicId: string

    @ApiPropertyOptional({ type: () => UserDto })
    creator: UserDto;

    constructor(entity: ClinicInforEntity) {
        super(entity);

        this.introduct = entity.introduct;
        this.strengths = entity.strengths;
        this.equipment = entity.equipment;
        this.location = entity.location;
        this.procedure = entity.procedure;
        // this.clinicId = entity.clinicId;

        if (entity.clinic) {
            this.clinic = entity.clinic;
        }

        if (entity.creator) {
            this.creator = entity.creator;
        }
    }
}