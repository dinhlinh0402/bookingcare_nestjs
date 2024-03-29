import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfigOptions } from './ormconfig';
import './polyfill';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ContextMiddleware } from './middlewares/context.middleware';
import { SharedModule } from './shared/shared.module';
import { ClinicModule } from './modules/clinic/clinic.module';
import { DoctorInforModule } from './modules/doctor-infor/doctor-infor.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { SpecialtyModule } from './modules/specialty/specialty.module';
import { SchedulesModule } from './modules/schedules/schedule.module';
import { BookingsModule } from './modules/bookings/booking.module';
import { HistoryModule } from './modules/history/history.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfigOptions),
    SharedModule,
    // ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    ClinicModule,
    DoctorInforModule,
    DoctorModule,
    SpecialtyModule,
    SchedulesModule,
    BookingsModule,
    HistoryModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware).forRoutes('*');
  }
}
