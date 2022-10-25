import { AbstractEntity } from "src/common/abstract.entity";
import { StatusSchedule } from "src/common/constants/schedule.enum";
import { Column, Entity, ManyToOne, Timestamp } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { ScheduleDto } from "./dto/schedule.dto";

@Entity({ name: 'schedules' })
export class ScheduleEntity extends AbstractEntity<ScheduleDto> {

    @Column({ type: 'enum', enum: StatusSchedule, default: StatusSchedule.ACTIVE })
    status: StatusSchedule;

    @Column()
    timeStart: Date;

    @Column()
    timeEnd: Date;

    @Column()
    date: string;

    @Column({ default: 1, comment: 'số lượng bệnh nhân trong thời gian đó' })
    maxCount: number;

    @ManyToOne(() => UserEntity)
    doctor: UserEntity;

    @ManyToOne(() => UserEntity)
    creator: UserEntity;

    dtoClass = ScheduleDto;
}