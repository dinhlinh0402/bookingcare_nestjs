import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { DoctorInforController } from './doctor-infor.controller';
import { DoctorInforRepository } from './doctor-infor.repository';
import { DoctorInforService } from './doctor-infor.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DoctorInforRepository,
      UserRepository,
    ])
  ],
  controllers: [DoctorInforController],
  providers: [DoctorInforService]
})
export class DoctorInforModule { }
