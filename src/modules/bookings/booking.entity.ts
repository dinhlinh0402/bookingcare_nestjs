import { AbstractEntity } from "src/common/abstract.entity";
import { BookingStatus, BookingType } from "src/common/constants/booking.enum";
import { GenderEnum } from "src/common/constants/gender";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { ScheduleEntity } from "../schedules/schedule.entity";
import { UserEntity } from "../user/user.entity";
import { BookingDto, BookingRelativesDto } from "./dto/booking.dto";

@Entity({ name: 'bookings_relatives' })
export class BookingRelativesEntity extends AbstractEntity<BookingRelativesDto> {

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column({ type: 'enum', enum: GenderEnum, default: GenderEnum.OTHER })
    gender: GenderEnum;

    @Column({ nullable: true })
    birthday: Date;

    @Column()
    address: string;

    // @OneToOne(() => BookingEntity)
    // @JoinColumn()
    // booking: BookingEntity;

    dtoClass = BookingRelativesDto;
}

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

    @Column({ type: 'enum', enum: BookingType, default: BookingType.FOR_MYSELF })
    type: BookingType;

    @Column({ type: 'longtext' })
    reason: string;

    @OneToOne(() => BookingRelativesEntity, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    bookingRelatives: BookingRelativesEntity;

    @ManyToOne(() => UserEntity, {
        onDelete: 'SET NULL'
    })
    creator: UserEntity;

    dtoClass = BookingDto;
}

