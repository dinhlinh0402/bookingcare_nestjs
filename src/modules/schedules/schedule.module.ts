import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulesController } from './schedule.controller';
import { ScheduleRepository } from './schedule.repository';
import { SchedulesService } from './schedule.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ScheduleRepository,
    ])
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService]
})
export class SchedulesModule { }
