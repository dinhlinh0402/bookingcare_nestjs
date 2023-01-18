import { ApiPropertyOptional } from "@nestjs/swagger";
import { BookingStatus, BookingType } from "src/common/constants/booking.enum";
import { GenderEnum } from "src/common/constants/gender";
import { AbstractDto } from "src/common/dto/abstract.dto";
import { HistoryDto } from "src/modules/history/dto/history.dto";
import { ScheduleDto } from "src/modules/schedules/dto/schedule.dto";
import { UserDto } from "src/modules/user/dto/user.dto";
import { BookingEntity, BookingRelativesEntity } from "../booking.entity";

export class BookingRelativesDto extends AbstractDto {
    @ApiPropertyOptional()
    name: string;

    @ApiPropertyOptional()
    email: string;

    @ApiPropertyOptional()
    phone: string;

    @ApiPropertyOptional({ type: 'enum', enum: GenderEnum })
    gender: GenderEnum;

    @ApiPropertyOptional()
    birthday: Date;

    @ApiPropertyOptional()
    address: string;

    constructor(entity: BookingRelativesEntity) {
        super(entity);

        this.name = entity.name;
        this.email = entity.email;
        this.phone = entity.phone;
        this.gender = entity.gender;
        this.birthday = entity.birthday;
        this.address = entity.address;
    }
}

export class BookingDto extends AbstractDto {
    @ApiPropertyOptional({ type: 'enum', enum: BookingStatus })
    status: BookingStatus;

    // @ApiPropertyOptional()
    // token: string;

    @ApiPropertyOptional({ type: () => UserDto })
    doctor: UserDto;

    @ApiPropertyOptional({ type: () => UserDto })
    patient: UserDto;

    @ApiPropertyOptional({ type: () => ScheduleDto })
    schedule: ScheduleDto;

    @ApiPropertyOptional({ type: 'enum', enum: BookingType })
    type: BookingType;

    @ApiPropertyOptional()
    reason: string;

    @ApiPropertyOptional()
    userNote: string;

    @ApiPropertyOptional({ type: () => BookingRelativesDto })
    bookingRelatives: BookingRelativesDto;

    @ApiPropertyOptional()
    date: Date;

    @ApiPropertyOptional()
    bookingDate: Date;

    @ApiPropertyOptional({ type: () => HistoryDto })
    history: HistoryDto

    constructor(entity: BookingEntity) {
        super(entity);

        this.status = entity.status;
        // this.token = entity.token;
        this.reason = entity.reason;
        this.date = entity.date;
        this.bookingDate = entity.bookingDate;
        this.type = entity.type;
        this.userNote = entity.userNote;

        if (entity.doctor) {
            this.doctor = entity.doctor;
        }

        if (entity.patient) {
            this.patient = entity.patient;
        }

        if (entity.schedule) {
            this.schedule = entity.schedule;
        }

        if (entity.bookingRelatives) {
            this.bookingRelatives = entity.bookingRelatives;
        }

        if (entity.history) {
            this.history = entity.history;
        }
    }
}