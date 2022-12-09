import { HttpStatus, Injectable } from '@nestjs/common';
import { CodeMessage } from 'src/common/constants/code-message';
import { ErrorException } from 'src/exceptions/error.exception';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { AuthService } from '../auth/auth.service';
import { IFile } from '../../common/interfaces/file.interface';
import { SpecialtyCreateDto, SpecialtyUpdateDto } from './dto/specialty-data';
import { SpecialtyPageDto, SpecialtyPageOptionsDto } from './dto/specialty-page';
import { SpecialtyEntity } from './specialty.entity';
import { SpecialtyRepository } from './specialty.repository';
import { ClinicRepository } from '../clinic/clinic.repository';
import { Brackets, In } from 'typeorm';

@Injectable()
export class SpecialtyService {
    constructor(
        public readonly specialtyRepo: SpecialtyRepository,
        public readonly clinicRepo: ClinicRepository,
    ) { }

    @Transactional()
    async createSpecialty(
        speciltyData: SpecialtyCreateDto,
        file: IFile
    ): Promise<SpecialtyEntity> {
        const authUse = AuthService.getAuthUser();

        const checkExit = await this.specialtyRepo.findOne({
            where: { name: speciltyData.name },
        })

        if (checkExit) {
            throw new ErrorException(
                HttpStatus.BAD_REQUEST,
                CodeMessage.SPECIALTY_AREADY_EXIST
            )
        }

        const specialty = this.specialtyRepo.create({
            ...speciltyData,
            image: file ? file.path : '',
            creator: authUse,
        })

        await this.specialtyRepo.save(specialty);
        return specialty;
    }

    async getSpecialties(pageOptionsData: SpecialtyPageOptionsDto): Promise<SpecialtyPageDto> {
        const queryBuilder = this.specialtyRepo
            .createQueryBuilder('specialty')
            .leftJoinAndSelect('specialty.creator', 'creator')
            .orderBy(`specialty.${pageOptionsData.orderBy}`, pageOptionsData.order)

        if (pageOptionsData.name) {
            queryBuilder.searchByString(pageOptionsData.name, ['specialty.name']);
        }

        if (pageOptionsData.q) {
            queryBuilder.searchByString(pageOptionsData.q, ['specialty.name']);
        }
        const [entities, pageMetaData] = await queryBuilder.paginate(pageOptionsData);

        return new SpecialtyPageDto(entities.toDtos(), pageMetaData)
    }

    async getSpecialtyById(specialtyId: string): Promise<SpecialtyEntity> {
        const specialty = await this.specialtyRepo.findOne({
            where: { id: specialtyId },
            relations: ['creator']
        })

        if (!specialty) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.SPECIALTY_NOT_EXIST
            );
        }

        return specialty;
    }

    @Transactional()
    async updateSpecialty(
        specialtyId: string,
        specialtyData: SpecialtyUpdateDto,
        file: IFile
    ): Promise<SpecialtyEntity> {

        let specialty = await this.specialtyRepo.findOne({
            where: { id: specialtyId },
            relations: ['creator']
        })
        if (!specialty) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.SPECIALTY_NOT_EXIST,
            );
        }
        if (file) {
            specialty.image = file.path;
        }

        specialty = Object.assign(specialty, specialtyData);
        await this.specialtyRepo.save(specialty);
        return specialty;
    }

    @Transactional()
    async deleteSpecialty(specialtyId: string): Promise<boolean> {
        let specialty = await this.specialtyRepo.findOne({
            where: { id: specialtyId },
            relations: ['creator']
        })
        if (!specialty) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.SPECIALTY_NOT_EXIST,
            );
        }

        const deleteSpecialty = await this.specialtyRepo.delete(specialty.id);
        return deleteSpecialty ? true : false;
    }

    async deleteManySpecialty(specialtyIds: string[]): Promise<boolean> {
        let listSpecialty = await this.specialtyRepo.find({
            select: ['id'],
            where: { id: In(specialtyIds) },
        })
        if (listSpecialty.length < specialtyIds.length) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.SPECIALTY_NOT_EXIST,
            );
        }

        const deleteSpecialty = await this.specialtyRepo.delete(specialtyIds);
        return deleteSpecialty ? true : false;
    }

    async getSpecialtiesByClinicId(
        clinicId: string,
        pageOptionsDto: SpecialtyPageOptionsDto
    ): Promise<SpecialtyPageDto> {
        const clinic = await this.clinicRepo.findOne({
            where: { id: clinicId, active: true },
            relations: ['specialties']
        })
        if (!clinic) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.CLINIC_NOT_EXIST,
            );
        }

        const queryBuilder = this.specialtyRepo
            .createQueryBuilder('specialties')
            .leftJoin(
                'clinics_specialties_specialties',
                'css',
                'css.specialties_id = specialties.id'
            )
            .leftJoin('clinics', 'c', 'c.id = css.clinics_id')
            .select(['specialties'])
            .where(
                'css.clinics_id = :clinicId AND c.active = :active', {
                clinicId: clinicId,
                active: true
            })

        const [entities, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto)

        return new SpecialtyPageDto(entities.toDtos(), pageMetaDto);

    }
}
