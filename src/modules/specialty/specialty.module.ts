import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicRepository } from '../clinic/clinic.repository';
import { SpecialtyController } from './specialty.controller';
import { SpecialtyRepository } from './specialty.repository';
import { SpecialtyService } from './specialty.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SpecialtyRepository,
      ClinicRepository
    ])
  ],
  controllers: [SpecialtyController],
  providers: [SpecialtyService]
})
export class SpecialtyModule { }
