import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleRepository } from '../schedules/schedule.repository';
import { UserRepository } from '../user/user.repository';
import { BookingssController } from './booking.controller';
import { BookingRelativesRepository, BookingRepository } from './booking.repository';
import { BookingsService } from './booking.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookingRepository,
      UserRepository,
      ScheduleRepository,
      BookingRelativesRepository,
    ])
  ],
  controllers: [BookingssController],
  providers: [BookingsService]
})
export class BookingsModule { }
