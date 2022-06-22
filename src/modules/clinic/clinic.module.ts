import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicController } from './clinic.controller';
import { ClinicRepository } from './clinic.repository';
import { ClinicService } from './clinic.service';
import { ClinicInforModule } from './clinic-infor/clinic-infor.module';
import { SpecialtyRepository } from '../specialty/specialty.repository';

@Module({
  imports: [TypeOrmModule.forFeature([
    ClinicRepository,
    SpecialtyRepository,
  ]),
    ClinicInforModule],
  controllers: [ClinicController],
  providers: [ClinicService]
})
export class ClinicModule { }
