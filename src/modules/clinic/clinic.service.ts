import { HttpStatus, Injectable } from '@nestjs/common';
import { CodeMessage } from 'src/common/constants/code-message';
import { ErrorException } from 'src/exceptions/error.exception';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { AuthService } from '../auth/auth.service';
import { SpecialtyRepository } from '../specialty/specialty.repository';
import { ClinicEntity } from './clinic.entity';
import { ClinicRepository } from './clinic.repository';
import { ClinicCreateDto, ClinicUpdateDto } from './dto/clinic-data.dto';
import { ClinicPageDto, ClinicPageOptionsDto } from './dto/clinic-page.dto';
import { IFile } from '../../common/interfaces/file.interface';

@Injectable()
export class ClinicService {
    constructor(
        public readonly clinicRepo: ClinicRepository,
        public readonly specialtyRepo: SpecialtyRepository,
    ) { }

    @Transactional()
    async createClinic(clincCreateDto: ClinicCreateDto, file: IFile): Promise<ClinicEntity> {
        const authUser = AuthService.getAuthUser();

        const checkExit = await this.clinicRepo.findOne({
            where: {
                name: clincCreateDto.name,
                email: clincCreateDto.email
            }
        })

        if (checkExit) {
            throw new ErrorException(
                HttpStatus.CONFLICT,
                CodeMessage.CLINIC_ALREADY_EXIST
            )
        }

        const { specialties, ...rest } = clincCreateDto;

        const clinic = this.clinicRepo.create({
            ...rest,
            image: file ? file.path : '',
            creator: authUser,
        })

        if (clincCreateDto.specialties && clincCreateDto.specialties.length) {
            let specialtyIdArray;
            try {
                specialtyIdArray = JSON.parse(clincCreateDto.specialties)
            } catch (error) {
                throw new ErrorException(
                    HttpStatus.BAD_REQUEST,
                    CodeMessage.PARSE_SPECIALTY_IDS_ERROR
                )
            }
            const specialties = await this.specialtyRepo.findByIds(
                specialtyIdArray
            );

            if (specialties.length < specialtyIdArray.length) {
                throw new ErrorException(
                    HttpStatus.NOT_FOUND,
                    CodeMessage.SPECIALTY_NOT_EXIST,
                );
            }
            clinic.specialties = specialties;
        }

        await this.clinicRepo.save(clinic);
        return clinic
    }

    async getClinics(
        clinicPageOptionsDto: ClinicPageOptionsDto
    ): Promise<ClinicPageDto> {
        // console.log(clinicPageOptionsDto);
        const queryBuilder = this.clinicRepo
            .createQueryBuilder('clinic')
            .leftJoinAndSelect('clinic.creator', 'creator')
            .leftJoinAndSelect('clinic.clinicInfor', 'clinicInfor')
            .leftJoinAndSelect('clinic.specialties', 'specialties')
            // .where('clinic.active = true')
            .orderBy(`clinic.${clinicPageOptionsDto.orderBy}`, clinicPageOptionsDto.order)

        if (clinicPageOptionsDto.name) {
            queryBuilder.andWhere(
                'clinic.name LIKE :nameClinic', {
                nameClinic: `%${clinicPageOptionsDto.name}%`
            }
            )
        }

        // if (clinicPageOptionsDto.active != undefined) {
        if (clinicPageOptionsDto.active && clinicPageOptionsDto.active.length) {
            queryBuilder.andWhere(
                'clinic.active IN (:active)', {
                active: clinicPageOptionsDto.active
            })
        }

        if (clinicPageOptionsDto.email) {
            queryBuilder.searchByString(clinicPageOptionsDto.email, ['clinic.email'])
        }

        if (clinicPageOptionsDto.phone) {
            queryBuilder.searchByString(clinicPageOptionsDto.phone, ['clinic.phone'])
        }

        if (clinicPageOptionsDto.q) {
            queryBuilder.searchByString(clinicPageOptionsDto.q, ['clinic.name'])
        }

        const [entities, pageMetaDto] = await queryBuilder.paginate(clinicPageOptionsDto);

        return new ClinicPageDto(entities.toDtos(), pageMetaDto)
    }

    async getClinicById(clinicId: string): Promise<ClinicEntity> {
        const clinic = await this.clinicRepo.findOne({
            relations: ['clinicInfor', 'creator', 'specialties'],
            where: { id: clinicId }
        })

        if (!clinic) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.CLINIC_NOT_EXIST
            )
        }

        return clinic;
    }

    @Transactional()
    async updateClinic(
        clinicId: string,
        clinicUpdateDto: ClinicUpdateDto,
        file: IFile
    ): Promise<ClinicEntity> {
        let clinic = await this.clinicRepo.findOne({
            where: { id: clinicId },
            relations: ['creator']
        });

        if (!clinic) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.CLINIC_NOT_EXIST
            );
        }
        if (file) {
            clinic.image = file.path;
        }

        clinic = Object.assign(clinic, clinicUpdateDto);

        if (clinicUpdateDto.specialties && clinicUpdateDto.specialties.length) {
            let specialtyIdArray;
            try {
                specialtyIdArray = JSON.parse(clinicUpdateDto.specialties)
            } catch (error) {
                throw new ErrorException(
                    HttpStatus.BAD_REQUEST,
                    CodeMessage.PARSE_SPECIALTY_IDS_ERROR
                )
            }
            const specialties = await this.specialtyRepo.findByIds(
                specialtyIdArray
            );

            if (specialties.length < specialtyIdArray.length) {
                throw new ErrorException(
                    HttpStatus.NOT_FOUND,
                    CodeMessage.SPECIALTY_NOT_EXIST,
                );
            }
            clinic.specialties = specialties;
        }

        await this.clinicRepo.save(clinic);
        return clinic;
    }

    @Transactional()
    async deleteClinic(clinicId: string): Promise<boolean> {
        const clinic = await this.clinicRepo.findOne({
            where: { id: clinicId },
        })

        if (!clinic) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.CLINIC_NOT_EXIST
            );
        }

        // const 

        await this.clinicRepo.delete(clinic.id);
        return true;
    }
}
