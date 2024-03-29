import { HttpStatus, Injectable } from '@nestjs/common';
import { CodeMessage } from 'src/common/constants/code-message';
import { ErrorException } from 'src/exceptions/error.exception';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { AuthService } from '../auth/auth.service';
import { SpecialtyRepository } from '../specialty/specialty.repository';
import { ClinicEntity } from './clinic.entity';
import { ClinicRepository } from './clinic.repository';
import { ClinicChangeActive, ClinicCreateDto, ClinicUpdateDto } from './dto/clinic-data.dto';
import { ClinicPageDto, ClinicPageOptionsDto } from './dto/clinic-page.dto';
import { IFile } from '../../common/interfaces/file.interface';
import { Brackets, In } from 'typeorm';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class ClinicService {
    constructor(
        public readonly clinicRepo: ClinicRepository,
        public readonly specialtyRepo: SpecialtyRepository,
        public readonly userRepo: UserRepository,
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
                specialtyIdArray = JSON.parse(clincCreateDto.specialties);
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

        if (clinicPageOptionsDto.province) {
            queryBuilder.searchByString(clinicPageOptionsDto.province, ['clinic.province'])
        }

        if (clinicPageOptionsDto.q) {
            // queryBuilder.searchByString(clinicPageOptionsDto.q, ['clinic.name'])
            queryBuilder
                .andWhere(
                    new Brackets((qb) =>
                        qb
                            .orWhere('clinic.name LIKE :q')
                            .orWhere('clinic.email LIKE :q')
                            .orWhere('clinic.phone LIKE :q')
                            .orWhere('clinic.province LIKE :q')
                    ),
                )
                .setParameter('q', `%${clinicPageOptionsDto.q}%`)
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

    async deleteManyClinic(clinicIds: string[]) {
        const listClinic = await this.clinicRepo.find({
            select: ['id'],
            where: { id: In(clinicIds) },
        })

        if (listClinic.length < clinicIds.length) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.CLINIC_NOT_EXIST
            );
        }

        // const 

        await this.clinicRepo.delete(clinicIds);
        return true;
    }

    async changeActiveClinic(dataChangeActive: ClinicChangeActive): Promise<boolean> {
        const listClinic = await this.clinicRepo.find({
            select: ['id'],
            where: { id: In(dataChangeActive.clinicIds) }
        })
        if (listClinic.length < dataChangeActive.clinicIds.length) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.CLINIC_NOT_EXIST
            );
        }
        await this.clinicRepo.update(
            { id: In(dataChangeActive.clinicIds) },
            { active: dataChangeActive.active }
        )

        // await this.userRepo.update(
        //     {clinic: In(dataChangeActive.clinicIds)},
        //     {status: dataChangeActive.active === true ? true : false}
        // )
        await this.userRepo
            .createQueryBuilder()
            .update('users')
            .set({ status: dataChangeActive.active === true ? true : false })
            .where({ clinic: In(dataChangeActive.clinicIds) })
            .execute();

        return true;
    }
} 
