import { HttpStatus, Injectable } from '@nestjs/common';
import { CodeMessage } from 'src/common/constants/code-message';
import { RoleEnum } from 'src/common/constants/role';
import { StatusSchedule } from 'src/common/constants/schedule.enum';
import { ErrorException } from 'src/exceptions/error.exception';
import { AuthService } from '../auth/auth.service';
import { ScheduleRepository } from '../schedules/schedule.repository';
import { UserRepository } from '../user/user.repository';
import { BookingRepository } from './booking.repository';
import { BookingCreateDto } from './dto/booking-data.dto';

@Injectable()
export class BookingsService {
    constructor(
        public readonly bookingRepo: BookingRepository,
        public readonly userRepo: UserRepository,
        public readonly scheduleRepo: ScheduleRepository,
    ) { }

    async createBooking(bookingData: BookingCreateDto) {
        const authUser = AuthService.getAuthUser();

        const doctor = await this.userRepo.findOne({
            where: {
                id: bookingData.doctorId,
                role: RoleEnum.DOCTOR
            }
        })

        if (!doctor) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.DOCTOR_NOT_EXIST,
            )
        }

        const patient = await this.userRepo.findOne({
            where: {
                id: bookingData.doctorId,
                role: RoleEnum.USER,
            }
        })

        if (!patient) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.USER_NOT_EXIST,
            )
        }

        const schedule = await this.userRepo.findOne({
            where: {
                id: bookingData.scheduleId,
                status: StatusSchedule.ACTIVE,
            }
        })

        if (!schedule) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.SCHEDULE_NOT_EXIST
            )
        }

        console.log('schedule: ', schedule);
        // for relatives for myself
    }
}
