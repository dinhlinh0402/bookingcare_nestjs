import { ApiPropertyOptional } from "@nestjs/swagger";
import { AbstractDto } from "src/common/dto/abstract.dto";
import { BookingDto } from "src/modules/bookings/dto/booking.dto";
import { HistoryEntity } from "../history.entity";

export class HistoryDto extends AbstractDto {
  @ApiPropertyOptional()
  doctorNote: string;

  @ApiPropertyOptional()
  prescription: string;

  @ApiPropertyOptional({type: () => BookingDto})
  booking: BookingDto;

  constructor(entity: HistoryEntity)  {
    super(entity);

    this.doctorNote = entity.doctorNote;
    this.prescription = entity.prescription;
    
    if(entity.booking) {
      this.booking = entity.booking;
    }
  }
}