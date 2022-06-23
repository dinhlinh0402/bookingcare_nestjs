import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { UserRepository } from '../user/user.repository';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      UserRepository
    ])
  ],
  controllers: [DoctorController],
  providers: [DoctorService]
})
export class DoctorModule { }
