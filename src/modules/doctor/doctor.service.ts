import { HttpStatus, Injectable } from '@nestjs/common';
import { CodeMessage } from 'src/common/constants/code-message';
import { RoleEnum } from 'src/common/constants/role';
import { ErrorException } from 'src/exceptions/error.exception';
import { UserEntity } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { DoctorPageDto, DoctorPageOptionsDto } from './dto/doctor-page.dto';

@Injectable()
export class DoctorService {

    constructor(
        public readonly userRepo: UserRepository,
    ) { }

    async getDoctors(
        pageOptionsDto: DoctorPageOptionsDto
    ): Promise<DoctorPageDto> {
        const queryBuilder = this.userRepo
            .createQueryBuilder('doctor')
            .leftJoinAndSelect('doctor.creator', 'creator')
            .leftJoinAndSelect('doctor.clinic', 'clinic')
            .leftJoinAndSelect('doctor.doctorInfor', 'doctorInfor')
            .leftJoinAndSelect('doctor.specialty', 'specialty')
            .where('doctor.role = :role AND clinic.active = :active', {
                role: RoleEnum.DOCTOR,
                active: true
            })
            .orderBy(`doctor.${pageOptionsDto.orderBy}`, pageOptionsDto.order)

        if (pageOptionsDto.name) {
            queryBuilder.andWhere(
                "REPLACE(CONCAT(COALESCE(doctor.first_name, ''), ' ', COALESCE(doctor.middle_name, ''), ' ', COALESCE(doctor.last_name,'')), '  ', ' ') LIKE :fullName",
                { fullName: `%${pageOptionsDto.name}%` },
            );
        }

        if (pageOptionsDto.email) {
            queryBuilder.searchByString(pageOptionsDto.email, ['doctor.email']);
        }

        if (pageOptionsDto.clinicId) {
            queryBuilder.andWhere('doctor.clinic_id = :clinicId', {
                clinicId: pageOptionsDto.clinicId,
            })
        }

        if (pageOptionsDto.specialtyId) {
            queryBuilder.andWhere('doctor.specialty_id = :specialtyId', {
                specialtyId: pageOptionsDto.specialtyId,
            })
        }

        if (pageOptionsDto.topDoctor != undefined && pageOptionsDto.topDoctor == true) {
            queryBuilder.orderBy(`doctorInfor.count`, pageOptionsDto.order)
        } else {
            queryBuilder.orderBy(`doctor.${pageOptionsDto.orderBy}`, pageOptionsDto.order)
        }

        const [entities, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

        return new DoctorPageDto(entities.toDtos(), pageMetaDto);
    }

    async getDoctorById(doctorId: string): Promise<UserEntity> {
        const doctor = await this.userRepo
            .createQueryBuilder('doctor')
            .leftJoinAndSelect('doctor.clinic', 'clinic')
            .leftJoinAndSelect('doctor.specialty', 'specialty')
            .where(
                'doctor.id = :doctorId AND doctor.role = :role AND clinic.active = :active', {
                doctorId: doctorId,
                role: RoleEnum.DOCTOR,
                active: true,
            }
            )
            .getOne();

        if (!doctor) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.DOCTOR_NOT_EXIST,
            )
        }

        return doctor;
    }
}
