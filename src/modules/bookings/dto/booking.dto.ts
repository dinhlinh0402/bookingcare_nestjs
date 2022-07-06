import { ApiPropertyOptional } from "@nestjs/swagger";
import { BookingStatus } from "src/common/constants/booking.enum";
import { AbstractDto } from "src/common/dto/abstract.dto";
import { ScheduleDto } from "src/modules/schedules/dto/schedule.dto";
import { UserDto } from "src/modules/user/dto/user.dto";
import { BookingEntity } from "../booking.entity";

export class BookingDto extends AbstractDto {
    @ApiPropertyOptional({ type: "enum", enum: BookingStatus })
    status: BookingStatus;

    @ApiPropertyOptional()
    token: string;

    @ApiPropertyOptional({ type: () => UserDto })
    doctor: UserDto;

    @ApiPropertyOptional({ type: () => UserDto })
    patient: UserDto;

    @ApiPropertyOptional({ type: () => ScheduleDto })
    schedule: ScheduleDto;

    @ApiPropertyOptional()
    reason: string;

    @ApiPropertyOptional()
    date: string;

    constructor(entity: BookingEntity) {
        super(entity);

        this.status = entity.status;
        this.token = entity.token;
        this.reason = entity.reason;
        this.date = entity.date;

        if (entity.doctor) {
            this.doctor = entity.doctor;
        }

        if (entity.patient) {
            this.patient = entity.patient;
        }

        if (entity.schedule) {
            this.schedule = entity.schedule;
        }
    }
}