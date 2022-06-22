import { HttpStatus, Injectable } from '@nestjs/common';
import { CodeMessage } from 'src/common/constants/code-message';
import { RoleEnum } from 'src/common/constants/role';
import { ErrorException } from 'src/exceptions/error.exception';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { DoctorInforEntity } from './doctor-infor.entity';
import { DoctorInforRepository } from './doctor-infor.repository';
import { DoctorInforCreateDto, DoctorInforUpdateDto } from './dto/doctor-infor-data.dto';

@Injectable()
export class DoctorInforService {
    constructor(
        public readonly doctorInforRepo: DoctorInforRepository,
        public readonly userRepo: UserRepository,
    ) { }

    @Transactional()
    async createDoctorInfor(doctorInforData: DoctorInforCreateDto): Promise<DoctorInforEntity> {
        const authUser = AuthService.getAuthUser();

        const doctor = await this.userRepo.findOne({
            where: { id: doctorInforData.doctorId, role: RoleEnum.DOCTOR },
            relations: ['clinic']
        })

        if (!doctor) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.DOCTOR_NOT_EXIST
            )
        }

        if (authUser.role != RoleEnum.ADMIN && authUser.role === RoleEnum.MANAGER_CLINIC && authUser.clinic.id != doctor.clinic.id) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.CLINIC_NOT_MATCH
            )
        }

        const doctorInfor = this.doctorInforRepo.create({
            ...doctorInforData,
            doctor: doctor,
            // creator: authUser,
        })

        doctor.doctorInfor = doctorInfor;
        await this.doctorInforRepo.save(doctorInfor);
        await this.userRepo.save(doctor);
        return doctorInfor
    }
    async getDoctorInforById(doctorInforId: string): Promise<DoctorInforEntity> {
        const doctorInfor = await this.doctorInforRepo.findOne({
            where: {
                id: doctorInforId,
            },
            relations: ['creator', 'doctor']
        })

        if (!doctorInfor) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.DOCTOR_INFOR_NOT_EXIST
            )
        }

        return doctorInfor;
    }

    @Transactional()
    async updateDoctorInfor(
        doctorInforData: DoctorInforUpdateDto,
        doctorInforId: string
    ) { //: Promise<DoctorInforEntity>
        const authUser = AuthService.getAuthUser();

        // const doctorInfor = await this.doctorInforRepo.findOne({
        //     where: {id: doctorInforId},
        //     relations: ['creator']
        // })

        const doctor = await this.userRepo.findOne({
            where: { doctorInfor: doctorInforId },
            relations: ['doctorInfor', 'clinic']
        })

        if (!doctor) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.DOCTOR_NOT_EXIST
            )
        }

        if (!doctor.doctorInfor) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.DOCTOR_INFOR_NOT_EXIST
            );
        }
        if (authUser.role != RoleEnum.ADMIN && authUser.role === RoleEnum.MANAGER_CLINIC && authUser.clinic.id != doctor.clinic.id) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.CLINIC_NOT_MATCH
            )
        }

        const doctorInfor = Object.assign(doctor.doctorInfor, doctorInforData);
        await this.doctorInforRepo.save(doctorInfor);
        return doctorInfor;
    }

    @Transactional()
    async deleteDoctorInfor(doctorInforId: string): Promise<boolean> {
        const authUser = AuthService.getAuthUser();

        const doctor = await this.userRepo.findOne({
            where: { doctorInfor: doctorInforId },
            relations: ['doctorInfor', 'clinic']
        })

        if (!doctor) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.DOCTOR_NOT_EXIST
            )
        }
        if (!doctor.doctorInfor) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.DOCTOR_INFOR_NOT_EXIST
            );
        }

        if (authUser.role != RoleEnum.ADMIN && authUser.role === RoleEnum.MANAGER_CLINIC && authUser.clinic.id != doctor.clinic.id) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.CLINIC_NOT_MATCH
            )
        }
        const updateDoctor = await this.userRepo
            .createQueryBuilder('doctor')
            .update(UserEntity)
            .set({ doctorInfor: null })
            .where('doctorInfor = :doctorInforId', { doctorInforId: doctorInforId })
            .execute();

        await this.doctorInforRepo.delete(doctorInforId);
        return true;
    }
}
