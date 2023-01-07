import { HttpStatus, Injectable } from '@nestjs/common';
import { BookingStatus, BookingType } from 'src/common/constants/booking.enum';
import { CodeMessage } from 'src/common/constants/code-message';
import { RoleEnum } from 'src/common/constants/role';
import { StatusSchedule } from 'src/common/constants/schedule.enum';
import { ErrorException } from 'src/exceptions/error.exception';
import { AuthService } from '../auth/auth.service';
import { ClinicEntity } from '../clinic/clinic.entity';
import { ScheduleRepository } from '../schedules/schedule.repository';
import { UserRepository } from '../user/user.repository';
import { BookingEntity } from './booking.entity';
import { BookingRelativesRepository, BookingRepository } from './booking.repository';
import { BookingCreateDto, BookingUpdateDto } from './dto/booking-data.dto';
import { BookingPageDto, BookingPageOptionsDto, BookingsByClinicDto } from './dto/booking-page.dto';
import { BookingDto } from './dto/booking.dto';

@Injectable()
export class BookingsService {
    constructor(
        public readonly bookingRepo: BookingRepository,
        public readonly userRepo: UserRepository,
        public readonly scheduleRepo: ScheduleRepository,
        public readonly bookingRelativesRepo: BookingRelativesRepository
    ) { }

    async createBooking(bookingData: BookingCreateDto) {
        const authUser = AuthService.getAuthUser();
        // console.log('bookingdata: ', bookingData);


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
                id: authUser.id,
                role: RoleEnum.USER,
            }
        })

        if (!patient) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.USER_NOT_EXIST,
            )
        }

        const schedule = await this.scheduleRepo.findOne({
            where: {
                id: bookingData.scheduleId,
                doctor: bookingData.doctorId,
                status: StatusSchedule.ACTIVE,
            }
        })

        if (!schedule) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.SCHEDULE_NOT_EXIST
            )
        }

        // console.log('schedule: ', schedule);

        // Đếm số lượng đã book
        const countBooking = await this.bookingRepo.createQueryBuilder('booking')
            .where('booking.schedule_id = :scheduleId AND booking.doctor_id = :doctorId', {
                scheduleId: bookingData.scheduleId,
                doctorId: bookingData.doctorId,
            })
            .getCount();

        if (countBooking === schedule.maxCount || countBooking >= schedule.maxCount) {
            throw new ErrorException(
                HttpStatus.BAD_REQUEST,
                CodeMessage.MAXIMUN_COUNT,
            );
        }

        const checkBooking = await this.bookingRepo.findOne({
            where: {
                doctor: bookingData.doctorId,
                schedule: bookingData.scheduleId,
                type: bookingData.type,
                patient: authUser.id,
            }
        })
        // console.log('checkBooking', checkBooking);
        if (checkBooking) {
            throw new ErrorException(
                HttpStatus.BAD_REQUEST,
                CodeMessage.YOU_HAVE_BOOKED,
            );
        }

        // for relatives for myself
        let booking;
        if (bookingData.type === BookingType.FOR_MYSELF) {
            booking = this.bookingRepo.create({
                status: BookingStatus.WAITING,
                date: bookingData.date,
                bookingDate: bookingData.bookingDate,
                doctor: doctor,
                patient: patient,
                schedule: schedule,
                reason: bookingData.reason,
                type: bookingData.type,
            })
            await this.bookingRepo.save(booking);
        } else {
            const booking_relatives = this.bookingRelativesRepo.create({
                name: bookingData.name,
                email: bookingData.email,
                phone: bookingData.phone,
                gender: bookingData.gender,
                birthday: bookingData.birthday || null,
                address: bookingData.address
            })
            const savebookingRelatives = await this.bookingRelativesRepo.save(booking_relatives);

            booking = this.bookingRepo.create({
                status: BookingStatus.WAITING,
                date: bookingData.date,
                bookingDate: bookingData.bookingDate,
                doctor: doctor,
                patient: patient,
                schedule: schedule,
                reason: bookingData.reason,
                type: bookingData.type,
                bookingRelatives: savebookingRelatives,
            })
            await this.bookingRepo.save(booking);
        }
        await this.scheduleRepo.update(
            { id: schedule.id },
            { booked: schedule.booked + 1 })

        return booking;
    }

    async getBookings(bookingData: BookingPageOptionsDto): Promise<BookingPageDto> {
        const user = AuthService.getAuthUser();
        if (!user) {
            throw new ErrorException(
                HttpStatus.UNAUTHORIZED,
                CodeMessage.UNAUTHORIZED,
            );
        }

        const queryBuilder = this.bookingRepo
            .createQueryBuilder('booking')
            .leftJoinAndSelect('booking.schedule', 'schedule')
            .leftJoinAndSelect('booking.doctor', 'doctor')
            .leftJoinAndSelect('booking.patient', 'patient')
            .leftJoinAndSelect('booking.bookingRelatives', 'bookingRelatives')
            .orderBy(`booking.${bookingData.orderBy}`, bookingData.order)

        if (bookingData.doctorId) {
            queryBuilder.andWhere('booking.doctor_id = :doctorId', {
                doctorId: bookingData.doctorId,
            })
        }

        if (bookingData.patientId) {
            queryBuilder.andWhere('booking.patient_id = :patientId', {
                patientId: bookingData.patientId,
            })
        }

        if (bookingData.date) {
            queryBuilder.andWhere('booking.date = :date', {
                date: bookingData.date,
            })
        }

        if (bookingData.status && bookingData.status.length) {
            queryBuilder.andWhere('booking.status IN (:status)', {
                status: bookingData.status,
            })
        }

        const [entities, pageMetaDto] = await queryBuilder.paginate(bookingData);
        return new BookingPageDto(entities.toDtos(), pageMetaDto);
    }

    async getBookingById(bookingId: string): Promise<BookingEntity> {
        const user = AuthService.getAuthUser();
        if (!user) {
            throw new ErrorException(
                HttpStatus.UNAUTHORIZED,
                CodeMessage.UNAUTHORIZED,
            );
        }

        const booking = await this.bookingRepo.findOne({
            where: { id: bookingId },
            relations: ['schedule', 'doctor', 'patient', 'bookingRelatives']
        })

        if (!booking) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.BOOKING_NOT_EXIST,
            );
        }
        return booking;
    }

    async updateBooking(bookingUpdateDto: BookingUpdateDto, bookingId: string): Promise<boolean> {
        const authUser = AuthService.getAuthUser();

        if (!authUser) {
            throw new ErrorException(
                HttpStatus.UNAUTHORIZED,
                CodeMessage.UNAUTHORIZED,
            );
        }

        let booked = await this.bookingRepo.findOne({
            where: { id: bookingId }
        })

        if (!booked) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.BOOKING_NOT_EXIST
            )
        }

        if (authUser.role === RoleEnum.DOCTOR) {
            await this.bookingRepo.update(
                { id: bookingId },
                { userNote: bookingUpdateDto.userNote }
            )
        } else if (authUser.role === RoleEnum.ADMIN || authUser.role === RoleEnum.MANAGER_CLINIC) {
            await this.bookingRepo.update(
                { id: bookingId },
                { status: bookingUpdateDto.status }
            )
        } else if (authUser.role === RoleEnum.USER) {
            booked = Object.assign(booked, bookingUpdateDto);
            await this.bookingRepo.save(booked);
        }

        return true;
    }

    async getBookingsByClinic(bookingData: BookingsByClinicDto) {
        const authUser = AuthService.getAuthUser();

        if (!authUser) {
            throw new ErrorException(
                HttpStatus.UNAUTHORIZED,
                CodeMessage.UNAUTHORIZED,
            );
        }

        const bookings = await this.bookingRepo
            .createQueryBuilder('bookings')
            .leftJoinAndSelect('bookings.doctor', 'doctor')
            .leftJoinAndSelect('bookings.patient', 'patient')
            .leftJoinAndSelect('bookings.schedule', 'schedule')
            .leftJoin(ClinicEntity, 'clinic', 'clinic.id = doctor.clinic')
            .where('clinic.id = :clinicId', {
                clinicId: bookingData.clinicId,
            })
            .orderBy('schedule.timeStart', 'ASC')
            .addOrderBy('schedule.timeEnd', 'ASC')
            .getMany();

        // WAITING, CONFIRMED, CANCEL, DONE
        let dataWaiting: BookingDto[] = [],
            dataConfirmed: BookingDto[] = [],
            dataCancel: BookingDto[] = [],
            dataDone: BookingDto[] = [];
        bookings.forEach(booking => {
            if (booking.status === BookingStatus.WAITING) {
                dataWaiting.push(booking);
            } else if (booking.status === BookingStatus.CONFIRMED) {
                dataConfirmed.push(booking);
            } else if (booking.status === BookingStatus.CANCEL) {
                dataCancel.push(booking);
            } else if (booking.status === BookingStatus.DONE) {
                dataDone.push(booking);
            }
        })

        return {
            waiting: {
                dataWaiting: dataWaiting,
                totalWaiting: dataWaiting.length || 0,
            },
            confirmed: {
                dataConfirmed: dataConfirmed,
                totalConfirmed: dataConfirmed.length || 0,
            },
            cancel: {
                dataCancel: dataCancel,
                totalCancel: dataCancel.length || 0,
            },
            done: {
                dataDone: dataDone,
                totalDone: dataDone.length || 0,
            },
        }
    }
}
