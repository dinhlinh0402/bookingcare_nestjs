import { AbstractEntity } from "src/common/abstract.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BookingEntity } from "../bookings/booking.entity";
import { HistoryDto } from "./dto/history.dto";

@Entity({name: 'history'})
export class HistoryEntity extends AbstractEntity<HistoryDto> {
  
  @Column({type: 'longtext', comment: 'Ghi chú của bác sĩ', nullable: true})
  doctorNote: string;

  @Column()
  prescription: string;

  @OneToOne(() => BookingEntity)
  booking: BookingEntity;

  dtoClass = HistoryDto;
}