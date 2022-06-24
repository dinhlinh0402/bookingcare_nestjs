import { ApiPropertyOptional } from "@nestjs/swagger";
import { StatusSchedule } from "src/common/constants/schedule.enum";
import { AbstractDto } from "src/common/dto/abstract.dto";
import { UserDto } from "src/modules/user/dto/user.dto";
import { ScheduleEntity } from "../schedule.entity";

export class ScheduleDto extends AbstractDto {
    @ApiPropertyOptional({ type: 'enum', enum: StatusSchedule })
    status: StatusSchedule

    @ApiPropertyOptional()
    timeStart: Date;

    @ApiPropertyOptional()
    timeEnd: Date;

    @ApiPropertyOptional({ type: () => UserDto })
    doctor: UserDto;

    @ApiPropertyOptional({ type: () => UserDto })
    creator: UserDto;

    constructor(entity: ScheduleEntity) {
        super(entity);

        this.status = entity.status;
        this.timeStart = entity.timeStart;
        this.timeEnd = entity.timeEnd;

        if (entity.doctor) {
            this.doctor = entity.doctor;
        }

        if (entity.creator) {
            this.creator = entity.creator;
        }
    }
}