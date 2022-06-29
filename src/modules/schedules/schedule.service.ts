import { HttpStatus, Injectable } from '@nestjs/common';
import { format, formatISO } from 'date-fns';
import { CodeMessage } from 'src/common/constants/code-message';
import { RoleEnum } from 'src/common/constants/role';
import { ErrorException } from 'src/exceptions/error.exception';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { AuthService } from '../auth/auth.service';
import { UserRepository } from '../user/user.repository';
import { ScheduleCreateDto } from './dto/schedule-data.dto';
import { ScheduleDto } from './dto/schedule.dto';
import { ScheduleEntity } from './schedule.entity';
import { ScheduleRepository } from './schedule.repository';

@Injectable()
export class SchedulesService {
    constructor(
        public readonly scheduleRepo: ScheduleRepository,
        public readonly userRepo: UserRepository,
    ) { }

    @Transactional()
    async createSchedule(scheduleData: ScheduleCreateDto): Promise<ScheduleDto[]> {
        const authUser = AuthService.getAuthUser();
        const doctor = await this.userRepo.findOne({
            where: {
                id: scheduleData.doctorId,
                role: RoleEnum.DOCTOR,
            },
            relations: ['clinic'],
        });
        console.log('authUser: ', authUser);
        console.log('doctor: ', doctor);

        if (!doctor) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.DOCTOR_NOT_EXIST,
            );
        }
        console.log('scheduleData: ', scheduleData);

        if (authUser.role == RoleEnum.MANAGER_CLINIC && authUser.clinic.id != doctor.clinic.id) {
            throw new ErrorException(
                HttpStatus.CONFLICT,
                CodeMessage.CLINIC_NOT_MATCH,
            );
        } else if (authUser.role == RoleEnum.DOCTOR && authUser.id != doctor.id) {
            throw new ErrorException(
                HttpStatus.CONFLICT,
                CodeMessage.DOCTOR_NOT_MATCH,
            );
        }

        if (scheduleData.times.length <= 0) {
            throw new ErrorException(
                HttpStatus.BAD_REQUEST,
                CodeMessage.TIMES_NOT_EMTY
            )
        }

        const { doctorId, times } = scheduleData;

        // const today = set(new Date(), { hours: 24, minutes: 60, seconds: 60 });
        // console.log('today: ', today);

        const dateNow = new Date();
        // const today = new Date(
        //     Date.UTC(
        //         dateNow.getFullYear(),
        //         dateNow.getMonth(),
        //         dateNow.getDate(),
        //         23,
        //         59,
        //         59,
        //     ),
        // )
        // console.log('setTime: ', today);

        const today = new Date();
        const todayTimezone = new Date(
            Date.UTC(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                today.getHours(),
                today.getMinutes(),
                today.getSeconds(),
                today.getMilliseconds()
            ),
        )
        console.log('today: ', today);
        console.log('todayTimezone: ', todayTimezone);

        const dataResponse: Array<ScheduleDto> = [];

        for (let i = 0; i < times.length; i++) {
            const time = times[i];
            if (time.timeStart > time.timeEnd || time.timeStart == time.timeEnd) {
                throw new ErrorException(
                    HttpStatus.BAD_REQUEST,
                    CodeMessage.TIME_END_MUST_BE_GREATER_THAN_TIME_START, //must be greater than
                );
            }

            const { timeStart, timeEnd } = time;

            const checkTimeStart = new Date(
                Date.UTC(
                    new Date(timeStart).getFullYear(),
                    new Date(timeStart).getMonth(),
                    new Date(timeStart).getDate(),
                    23,
                    59,
                    59
                )
            )
            console.log('checkTimeStart: ', checkTimeStart.getTime());

            const checkTimeEnd = new Date(
                Date.UTC(
                    new Date(timeEnd).getFullYear(),
                    new Date(timeEnd).getMonth(),
                    new Date(timeEnd).getDate(),
                    23,
                    59,
                    59
                )
            )

            console.log('checkTimeEnd: ', checkTimeEnd.getTime());

            if (checkTimeStart.getTime() != checkTimeEnd.getTime()) {
                throw new ErrorException(
                    HttpStatus.BAD_REQUEST,
                    CodeMessage.START_DATE_MUST_BE_EQUAL_END_DATE
                )
            }

            if (todayTimezone.getTime() > new Date(timeStart).getTime() || todayTimezone.getTime() > new Date(timeEnd).getTime()) {
                throw new ErrorException(
                    HttpStatus.BAD_REQUEST,
                    CodeMessage.TIME_START_OR_TIME_END_MUST_BE_GREATER_THAN_DATE_TIME_NOW,
                );
            }

            const schedule = this.scheduleRepo.create({
                doctor: doctor,
                creator: authUser,
                timeStart: timeStart,
                timeEnd: timeEnd,
            })

            await this.scheduleRepo.save(schedule);
            dataResponse.push(schedule.toDto())
        }
        return dataResponse;
    }

    async getScheduleById(scheduleId: string): Promise<ScheduleEntity> {
        const schedule = await this.scheduleRepo.findOne({
            where: { id: scheduleId },
            relations: ['doctor'],
        })

        if (!schedule) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.SCHEDULE_NOT_EXIST
            )
        }

        return schedule;
    }
}
