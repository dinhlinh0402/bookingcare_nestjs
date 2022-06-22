import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicRepository } from '../clinic.repository';
import { ClinicInforController } from './clinic-infor.controller';
import { ClinicInforRepository } from './clinic-infor.repository';
import { ClinicInforService } from './clinic-infor.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClinicInforRepository,
      ClinicRepository,
    ])
  ],
  controllers: [ClinicInforController],
  providers: [ClinicInforService]
})
export class ClinicInforModule { }
