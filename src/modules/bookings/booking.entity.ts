import { AbstractEntity } from "src/common/abstract.entity";
import { BookingStatus } from "src/common/constants/booking.enum";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ScheduleEntity } from "../schedules/schedule.entity";
import { UserEntity } from "../user/user.entity";
import { BookingDto } from "./dto/booking.dto";

@Entity({ name: 'bookings' })
export class BookingEntity extends AbstractEntity<BookingDto> {

    @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.WAITING })
    status: BookingStatus;

    @Column()
    token: string;

    @Column()
    date: string;

    @ManyToOne(() => UserEntity, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    doctor: UserEntity;

    @ManyToOne(() => UserEntity, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    patient: UserEntity;

    @ManyToOne(() => UserEntity, {
        onDelete: 'SET NULL'
    })
    schedule: ScheduleEntity;

    @Column({ type: 'longtext' })
    reason: string;

    dtoClass = BookingDto;
}