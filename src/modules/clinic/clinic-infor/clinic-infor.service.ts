import { HttpStatus, Injectable } from '@nestjs/common';
import { CodeMessage } from 'src/common/constants/code-message';
import { ErrorException } from 'src/exceptions/error.exception';
import { AuthService } from 'src/modules/auth/auth.service';
import { SpecialtyRepository } from 'src/modules/specialty/specialty.repository';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { ClinicEntity } from '../clinic.entity';
import { ClinicRepository } from '../clinic.repository';
import { ClinicInforEntity } from './clinic-infor.entity';
import { ClinicInforRepository } from './clinic-infor.repository';
import { ClinicInforCreateDto, ClinicInforUpdateDto } from './dto/clinic-infor-data.dto';

@Injectable()
export class ClinicInforService {
    constructor(
        public readonly clinicInforRepo: ClinicInforRepository,
        public readonly clinicRepo: ClinicRepository,
    ) { }

    @Transactional()
    async createClinicInfor(clinicInforData: ClinicInforCreateDto): Promise<ClinicInforEntity> {
        const authUser = AuthService.getAuthUser();
        const clinic = await this.clinicRepo.findOne({
            where: { id: clinicInforData.clinicId },
            relations: ['creator']
        })

        if (!clinic) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.CLINIC_NOT_EXIST
            )
        }

        const clinicInfor = this.clinicInforRepo.create({
            ...clinicInforData,
            creator: authUser,
            clinic: clinic
        })
        clinic.clinicInfor = clinicInfor
        await this.clinicInforRepo.save(clinicInfor);
        await this.clinicRepo.save(clinic);
        return clinicInfor
    }

    async getClinicById(clinicInforId: string): Promise<ClinicInforEntity> {
        const clinicInfor = await this.clinicInforRepo.findOne({
            where: { id: clinicInforId },
            relations: ['creator']
        });

        if (!clinicInfor) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.CLINIC_INFOR_NOT_EXIST
            );
        }

        return clinicInfor;
    }

    @Transactional()
    async updateClinicInfor(
        clinicInforId: string,
        clinicInforData: ClinicInforUpdateDto
    ): Promise<ClinicInforEntity> {
        const authUser = AuthService.getAuthUser();

        let clinicInfor = await this.clinicInforRepo.findOne({
            where: { id: clinicInforId },
        })
        console.log('clinicInfor: ', clinicInfor);

        if (!clinicInfor) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.CLINIC_INFOR_NOT_EXIST
            );
        }

        clinicInfor = Object.assign(clinicInfor, clinicInforData);
        await this.clinicInforRepo.save(clinicInfor);
        return clinicInfor;
    }

    @Transactional()
    async deleteClinicInfor(clinicInforId: string): Promise<boolean> {
        const clinicInfor = await this.clinicInforRepo.findOne({
            where: { id: clinicInforId },
        })
        console.log('clinicInfor: ', clinicInfor);

        if (!clinicInfor) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.CLINIC_INFOR_NOT_EXIST
            );
        }

        const updateClinic = await this.clinicRepo
            .createQueryBuilder('clinic')
            .update(ClinicEntity)
            .set({ clinicInfor: null })
            .where('clinic_infor_id = :clinicInforId', { clinicInforId: clinicInfor.id })
            .execute();

        const deleteClinicInfor = await this.clinicInforRepo.delete(clinicInfor.id);
        if (!deleteClinicInfor) {
            return false
        }
        return true;
    }
}
