import { ApiPropertyOptional } from "@nestjs/swagger";
import { DoctorInforPayment, DoctorInforPosition } from "src/common/constants/doctor-infor.enum";
import { AbstractDto } from "src/common/dto/abstract.dto";
import { UserDto } from "src/modules/user/dto/user.dto";
import { UserEntity } from "src/modules/user/user.entity";
import { DoctorInforEntity } from "../doctor-infor.entity";

export class DoctorInforDto extends AbstractDto {
    @ApiPropertyOptional()
    description: string;

    @ApiPropertyOptional()
    price: number;

    @ApiPropertyOptional()
    introduct: string;

    // @ApiPropertyOptional()
    // count: number;

    @ApiPropertyOptional({ enum: DoctorInforPayment })
    payment;

    @ApiPropertyOptional()
    note: string;

    @ApiPropertyOptional({ enum: DoctorInforPosition })
    position: string;

    // @ApiPropertyOptional({ type: () => UserDto })
    // doctor: UserDto;

    // @ApiPropertyOptional()
    // doctorId: string;

    @ApiPropertyOptional({ type: () => UserDto })
    creator: UserDto;

    constructor(entity: DoctorInforEntity) {
        super(entity);

        this.description = entity.description;
        this.price = entity.price;
        this.introduct = entity.introduct;
        // this.count = entity.count;
        this.payment = entity.payment;
        this.position = entity.position;
        this.note = entity.note;
        // this.doctorId = entity.doctorId;

        // if (entity.doctor) {
        //     this.doctor = entity.doctor;
        // }

        if (entity.creator) {
            this.creator = entity.creator;
        }

    }
}