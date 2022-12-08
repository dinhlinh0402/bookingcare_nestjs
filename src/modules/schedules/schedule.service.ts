import { HttpStatus, Injectable } from '@nestjs/common';
import { format, formatISO } from 'date-fns';
import { CodeMessage } from 'src/common/constants/code-message';
import { RoleEnum } from 'src/common/constants/role';
import { StatusSchedule } from 'src/common/constants/schedule.enum';
import { ErrorException } from 'src/exceptions/error.exception';
import { Brackets } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { AuthService } from '../auth/auth.service';
import { UserRepository } from '../user/user.repository';
import { SchedulePageDto, SchedulePageOptionsDto } from './dto/schdule-page.dto';
import { ScheduleCreateDto, ScheduleUpdateDto } from './dto/schedule-data.dto';
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

        if (!doctor) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.DOCTOR_NOT_EXIST,
            );
        }

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

        const dateNow = new Date();

        const today = new Date();
        // kết quả trả về là đúng với múi giờ hiện tại
        // nếu fe gửi  tz -7 thì today cũng phỉa -7. Nen trường hợp này sai.
        // const todayTimezone = new Date(
        //     Date.UTC(
        //         today.getFullYear(),
        //         today.getMonth(),
        //         today.getDate(),
        //         today.getHours(),
        //         today.getMinutes(),
        //         today.getSeconds(),
        //         today.getMilliseconds()
        //     ),
        // )

        // chuyển về dạng 2022-06-30T00:00:00.000
        // const date = new Date(
        //     Date.UTC(
        //         new Date(scheduleData.date).getFullYear(),
        //         new Date(scheduleData.date).getMonth(),
        //         new Date(scheduleData.date).getDate(),
        //         23,
        //         59,
        //         60
        //     ) - (24 * 60 * 60),
        // )

        const date = new Date(
            Date.UTC(
                new Date(scheduleData.date).getFullYear(),
                new Date(scheduleData.date).getMonth(),
                new Date(scheduleData.date).getDate() - 1,
                23,
                59,
                60
            ),
        )

        // const date = new Date(
        //     Math.floor(new Date(scheduleData.date).getTime() / 86400000) * 86400000 - 7 * 3600000,
        // );

        console.log('today: ', today);
        // console.log('todayTimezone: ', todayTimezone);
        console.log('date old: ', scheduleData.date);
        console.log('date: ', date);
        // console.log('date: ', new Date(scheduleData.date));
        // console.log('date: ', new Date(scheduleData.date).getTime());
        console.log('date: ', date.getTime() / 1000);

        const tesst = date.getTime();
        console.log('tesst gettime(): ', tesst);


        console.log('tesst: ', new Date(tesst));

        // console.log('date.getime(): ', date.getTime());
        // console.log('date. new Date(): ', new Date(date.getTime() / 1000));


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
            // console.log('checkTimeStart: ', checkTimeStart.getTime());

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

            const checkDate = new Date(
                Date.UTC(
                    new Date(scheduleData.date).getFullYear(),
                    new Date(scheduleData.date).getMonth(),
                    new Date(scheduleData.date).getDate(),
                    23,
                    59,
                    59
                )
            )

            if (checkTimeStart.getTime() != checkTimeEnd.getTime()) {
                throw new ErrorException(
                    HttpStatus.BAD_REQUEST,
                    CodeMessage.START_DATE_MUST_BE_EQUAL_END_DATE
                )
            }

            if (checkDate.getTime() != checkTimeStart.getTime() || checkDate.getTime() != checkTimeEnd.getTime()) {
                throw new ErrorException(
                    HttpStatus.BAD_REQUEST,
                    CodeMessage.DATE_MUST_BE_EQUAL_START_DATE_OR_END_DATE
                )
            }

            // if (todayTimezone.getTime() > new Date(timeStart).getTime() || todayTimezone.getTime() > new Date(timeEnd).getTime()) {
            //     throw new ErrorException(
            //         HttpStatus.BAD_REQUEST,
            //         CodeMessage.TIME_START_OR_TIME_END_MUST_BE_GREATER_THAN_DATE_TIME_NOW,
            //     );
            // }

            if (today.getTime() > new Date(timeStart).getTime() || today.getTime() > new Date(timeEnd).getTime()) {
                throw new ErrorException(
                    HttpStatus.BAD_REQUEST,
                    CodeMessage.TIME_START_OR_TIME_END_MUST_BE_GREATER_THAN_DATE_TIME_NOW,
                );
            }

            if (new Date(timeStart).getTime() == new Date(timeEnd).getTime()) {
                throw new ErrorException(
                    HttpStatus.BAD_REQUEST,
                    CodeMessage.TIME_START_NOT_BE_EQUAL_TIME_END,
                );
            }

            const checkSchedule = await this.scheduleRepo
                .createQueryBuilder('schedule')
                .where(
                    'schedule.doctor_id = :doctorId AND schedule.date = :date AND schedule.status = :status', {
                    doctorId: scheduleData.doctorId,
                    date: date.getTime().toString(),
                    status: StatusSchedule.ACTIVE,
                })
                .andWhere(
                    new Brackets((qb) => {
                        qb.andWhere(
                            'schedule.time_start < :timeStart AND schedule.time_end > :timeStart AND schedule.time_start < :timeEnd AND schedule.time_end > :timeEnd', {
                            timeStart: format(new Date(timeStart), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
                            timeEnd: format(new Date(timeEnd), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
                        })
                            .orWhere(
                                'schedule.time_start > :timeStart AND schedule.time_end > :timeStart AND schedule.time_start < :timeEnd AND schedule.time_end > :timeEnd', {
                                timeStart: format(new Date(timeStart), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
                                timeEnd: format(new Date(timeEnd), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
                            })
                            .orWhere(
                                'schedule.time_start < :timeStart AND schedule.time_end > :timeStart AND schedule.time_start < :timeEnd AND schedule.time_end < :timeEnd', {
                                timeStart: format(new Date(timeStart), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
                                timeEnd: format(new Date(timeEnd), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
                            })
                    })
                )
                .getMany()

            console.log("checkSchedule: ", checkSchedule);

            if (checkSchedule && checkSchedule.length > 0) {
                throw new ErrorException(
                    HttpStatus.BAD_REQUEST,
                    'INVALID DATE'
                )
            }

            const schedule = this.scheduleRepo.create({
                doctor: doctor,
                creator: authUser,
                timeStart: timeStart,
                timeEnd: timeEnd,
                date: date.getTime().toString(),
                maxCount: scheduleData.maxCount,
            })

            await this.scheduleRepo.save(schedule);
            dataResponse.push(schedule.toDto())
        }
        return dataResponse;
    }

    @Transactional()
    async updateSchedule(
        scheduleData: ScheduleUpdateDto,
        doctorId: string,
    ): Promise<ScheduleDto[]> {
        const authUser = AuthService.getAuthUser();
        const doctor = await this.userRepo.findOne({
            where: {
                id: doctorId,
                role: RoleEnum.DOCTOR,
            },
            relations: ['clinic'],
        });

        if (!doctor) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.DOCTOR_NOT_EXIST,
            );
        }

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

        const date = new Date(
            Date.UTC(
                new Date(scheduleData.date).getFullYear(),
                new Date(scheduleData.date).getMonth(),
                new Date(scheduleData.date).getDate() - 1,
                23,
                59,
                60
            ),
        )
        const today = new Date();

        console.log('date: ', date);

        await this.scheduleRepo
            .createQueryBuilder()
            .delete()
            .from(ScheduleEntity)
            .where(
                'doctor_id = :doctorId AND date = :date AND status = :status', {
                doctorId: doctor.id,
                date: date.getTime(),
                status: StatusSchedule.ACTIVE,
            })
            .execute();

        const dataResponse: Array<ScheduleDto> = [];
        const { times } = scheduleData;
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

            const checkDate = new Date(
                Date.UTC(
                    new Date(scheduleData.date).getFullYear(),
                    new Date(scheduleData.date).getMonth(),
                    new Date(scheduleData.date).getDate(),
                    23,
                    59,
                    59
                )
            )

            if (checkTimeStart.getTime() != checkTimeEnd.getTime()) {
                throw new ErrorException(
                    HttpStatus.BAD_REQUEST,
                    CodeMessage.START_DATE_MUST_BE_EQUAL_END_DATE
                )
            }

            if (checkDate.getTime() != checkTimeStart.getTime() || checkDate.getTime() != checkTimeEnd.getTime()) {
                throw new ErrorException(
                    HttpStatus.BAD_REQUEST,
                    CodeMessage.DATE_MUST_BE_EQUAL_START_DATE_OR_END_DATE
                )
            }

            // if (todayTimezone.getTime() > new Date(timeStart).getTime() || todayTimezone.getTime() > new Date(timeEnd).getTime()) {
            //     throw new ErrorException(
            //         HttpStatus.BAD_REQUEST,
            //         CodeMessage.TIME_START_OR_TIME_END_MUST_BE_GREATER_THAN_DATE_TIME_NOW,
            //     );
            // }

            if (today.getTime() > new Date(timeStart).getTime() || today.getTime() > new Date(timeEnd).getTime()) {
                throw new ErrorException(
                    HttpStatus.BAD_REQUEST,
                    CodeMessage.TIME_START_OR_TIME_END_MUST_BE_GREATER_THAN_DATE_TIME_NOW,
                );
            }

            const checkSchedule = await this.scheduleRepo
                .createQueryBuilder('schedule')
                .where(
                    'schedule.doctor_id = :doctorId AND schedule.date = :date AND schedule.status = :status', {
                    doctorId: doctor.id,
                    date: date.getTime().toString(),
                    status: StatusSchedule.ACTIVE,
                })
                .andWhere(
                    new Brackets((qb) => {
                        qb.andWhere(
                            'schedule.time_start < :timeStart AND schedule.time_end > :timeStart AND schedule.time_start < :timeEnd AND schedule.time_end > :timeEnd', {
                            timeStart: format(new Date(timeStart), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
                            timeEnd: format(new Date(timeEnd), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
                        })
                            .orWhere(
                                'schedule.time_start > :timeStart AND schedule.time_end > :timeStart AND schedule.time_start < :timeEnd AND schedule.time_end > :timeEnd', {
                                timeStart: format(new Date(timeStart), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
                                timeEnd: format(new Date(timeEnd), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
                            })
                            .orWhere(
                                'schedule.time_start < :timeStart AND schedule.time_end > :timeStart AND schedule.time_start < :timeEnd AND schedule.time_end < :timeEnd', {
                                timeStart: format(new Date(timeStart), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
                                timeEnd: format(new Date(timeEnd), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
                            })
                    })
                )
                .getMany()

            console.log("checkSchedule: ", checkSchedule);

            if (checkSchedule && checkSchedule.length > 0) {
                throw new ErrorException(
                    HttpStatus.BAD_REQUEST,
                    'INVALID DATE'
                )
            }

            const schedule = this.scheduleRepo.create({
                doctor: doctor,
                creator: authUser,
                timeStart: timeStart,
                timeEnd: timeEnd,
                date: date.getTime().toString(),
                maxCount: scheduleData.maxCount,
            })

            await this.scheduleRepo.save(schedule);
            dataResponse.push(schedule.toDto())
        }
        return dataResponse;

    }

    async getSchedules(pageOptionsDto: SchedulePageOptionsDto): Promise<SchedulePageDto> {
        const doctor = await this.userRepo.findOne({
            where: {
                id: pageOptionsDto.doctorId,
                role: RoleEnum.DOCTOR,
            }
        });

        if (!doctor) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.DOCTOR_NOT_EXIST,
            )
        }

        const timeNow = new Date();
        console.log('timeNow', timeNow);

        // convert về đầu ngày vd 2022-10-19T00:00:00.822Z
        const date = new Date(
            Date.UTC(
                new Date(pageOptionsDto.date).getFullYear(),
                new Date(pageOptionsDto.date).getMonth(),
                new Date(pageOptionsDto.date).getDate() - 1,
                23,
                59,
                60
            ),
        )
        console.log('date: ', date.getTime());

        await this.scheduleRepo
            .createQueryBuilder('schedule')
            .update(ScheduleEntity)
            .set({ status: StatusSchedule.EXPIRED })
            .where('time_start <= :timeNow AND status = :status AND date < :date', {
                timeNow: timeNow,
                status: StatusSchedule.ACTIVE,
                date: timeNow.getTime(),
            })
            .execute();

        const queryBuilder = this.scheduleRepo
            .createQueryBuilder('schedule')
            .leftJoinAndSelect('schedule.doctor', 'doctor')
            .leftJoinAndSelect('schedule.creator', 'creator')
            .where('schedule.status = :status', {
                status: StatusSchedule.ACTIVE,
            })
            .andWhere(
                'schedule.date = :date AND schedule.time_start > :timeNow AND schedule.doctor_id = :doctorId', {
                date: date.getTime(),
                timeNow: timeNow,
                doctorId: pageOptionsDto.doctorId,
            })

        const [entities, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

        return new SchedulePageDto(entities.toDtos(), pageMetaDto);

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

    async deleteSchedule(scheduleId: string): Promise<boolean> {
        const schedule = await this.scheduleRepo.findOne({
            id: scheduleId
        })

        if (!schedule) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.SCHEDULE_NOT_EXIST
            )
        }

        await this.scheduleRepo.delete(schedule.id)

        return true;
    }
}
