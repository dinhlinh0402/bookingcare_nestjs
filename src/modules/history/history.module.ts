import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingRepository } from '../bookings/booking.repository';
import { HistoryController } from './history.controller';
import { HistoryRepository } from './history.repository';
import { HistoryService } from './history.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HistoryRepository,
      BookingRepository,
    ])
  ],
  controllers: [HistoryController],
  providers: [HistoryService]
})
export class HistoryModule { }