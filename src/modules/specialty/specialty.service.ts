import { HttpStatus, Injectable } from '@nestjs/common';
import { CodeMessage } from 'src/common/constants/code-message';
import { ErrorException } from 'src/exceptions/error.exception';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { AuthService } from '../auth/auth.service';
import { SpecialtyCreateDto, SpecialtyUpdateDto } from './dto/specialty-data';
import { SpecialtyPageDto, SpecialtyPageOptionsDto } from './dto/specialty-page';
import { SpecialtyEntity } from './specialty.entity';
import { SpecialtyRepository } from './specialty.repository';

@Injectable()
export class SpecialtyService {
    constructor(
        public readonly specialtyRepo: SpecialtyRepository,
    ) { }

    @Transactional()
    async createSpecialty(speciltyData: SpecialtyCreateDto): Promise<SpecialtyEntity> {
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
            queryBuilder.searchByString(pageOptionsData.q, ['specialty.name', 'specialty.description']);
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
        specialtyData: SpecialtyUpdateDto
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
}
