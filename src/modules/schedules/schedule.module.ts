import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { SchedulesController } from './schedule.controller';
import { ScheduleRepository } from './schedule.repository';
import { SchedulesService } from './schedule.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ScheduleRepository,
      UserRepository,
    ])
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService]
})
export class SchedulesModule { }
