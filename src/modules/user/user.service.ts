import { HttpStatus, Injectable } from '@nestjs/common';
import { RoleEnum } from 'src/common/constants/role';
import { IFile } from 'src/common/interfaces/file.interface';
import { UtilsService } from 'src/providers/util.service';
import { sendMail } from 'src/utils/sendMail.util';
import { Brackets, FindOneOptions, In } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CodeMessage } from '../../common/constants/code-message';
import { ErrorException } from '../../exceptions/error.exception';
import { AuthService } from '../auth/auth.service';
import { UserRegisterDto } from '../auth/dto/user-register.dto';
import { ClinicRepository } from '../clinic/clinic.repository';
import { SpecialtyRepository } from '../specialty/specialty.repository';
import { UserCreateDto, UserDelete, UserUpdateDto, UserUpdateStatus } from './dto/user-data.dto';
import { UsersPageDto, UsersPageOptionsDto } from './dto/user-page.dto';
import { newUserMailTemplate, newUserSubject } from './mail.template';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        public readonly userRepo: UserRepository,
        public readonly clinicRepo: ClinicRepository,
        public readonly specialtyRepo: SpecialtyRepository,
    ) { }

    async isUserExist(email: string) {
        const queryBuilder = this.userRepo.createQueryBuilder('user')

        const user = queryBuilder.where('user.email = :email', {
            email
        }).getOne();
        console.log(user);

        return user ? user : false;
    }

    // Create account for admin, manager clinic, doctor
    @Transactional()
    async createUser(userCreateDto: UserCreateDto, file: IFile): Promise<UserEntity> {
        const authUser = AuthService.getAuthUser();

        if (await this.isUserExist(userCreateDto.email)) {
            throw new ErrorException(
                HttpStatus.CONFLICT,
                CodeMessage.USER_ALREADY_EXIST
            )
        }

        const password = Array(8)
            .fill(null)
            .map(() => Math.floor(Math.random() * 10))
            .join('');

        // console.log('password: ', password);
        const hashPassword = UtilsService.generateHash(password);

        if (userCreateDto.role) {
            if (authUser.role == RoleEnum.DOCTOR && userCreateDto.role == RoleEnum.ADMIN) {
                throw new ErrorException(
                    HttpStatus.BAD_REQUEST,
                    CodeMessage.ROLE_DOCTOR_NOT_CREATE_FOR_ROLE_ADMIN
                );
            } else if (authUser.role == RoleEnum.DOCTOR && userCreateDto.role == RoleEnum.MANAGER_CLINIC) {
                throw new ErrorException(
                    HttpStatus.BAD_REQUEST,
                    CodeMessage.ROLE_DOCTOR_NOT_CREATE_FOR_ROLE_MANAGER
                );
            } else if (authUser.role == RoleEnum.MANAGER_CLINIC && userCreateDto.role == RoleEnum.ADMIN) {
                throw new ErrorException(
                    HttpStatus.BAD_REQUEST,
                    CodeMessage.ROLE_MANAGER_NOT_CREATE_FOR_ROLE_ADMIN
                );
            }
        }

        const user = this.userRepo.create({
            ...userCreateDto,
            password: hashPassword,
            avatar: file ? file.path : '',
            creator: authUser,
        })



        if (userCreateDto.clinicId) {
            const clinic = await this.clinicRepo.findOne({
                where: { id: userCreateDto.clinicId }
            });

            if (!clinic) {
                throw new ErrorException(
                    HttpStatus.NOT_FOUND,
                    CodeMessage.CLINIC_NOT_EXIST
                );
            }
            user.clinic = clinic;
        }

        if (userCreateDto.specialtyId) {
            const specialty = await this.specialtyRepo.findOne({
                where: { id: userCreateDto.specialtyId }
            });

            if (!specialty) {
                throw new ErrorException(
                    HttpStatus.NOT_FOUND,
                    CodeMessage.SPECIALTY_NOT_EXIST,
                );
            }

            user.specialty = specialty;
        }

        const createNewUser = await this.userRepo.save(user)

        if (createNewUser) {
            const mailContent = newUserMailTemplate(
                createNewUser.lastName,
                createNewUser.email,
                password
            )
            try {
                await sendMail(user.email, newUserSubject, mailContent)
            } catch (error) {
                console.log('error: ', error);
                throw new ErrorException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    CodeMessage.CAN_NOT_SEND_MAIL_TO_USER,
                );
            }

        }

        return user;
    }

    // For User
    @Transactional()
    async register(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
        if (await this.isUserExist(userRegisterDto.email)) {
            throw new ErrorException(
                HttpStatus.CONFLICT,
                CodeMessage.USER_ALREADY_EXIST
            )
        }

        if (userRegisterDto.password !== userRegisterDto.confirmPassword) {
            throw new ErrorException(
                HttpStatus.CONFLICT,
                CodeMessage.PASSWORD_NOT_MATCH
            )
        }
        const hashPassword = UtilsService.generateHash(userRegisterDto.password);
        const user = this.userRepo.create({
            ...userRegisterDto,
            password: hashPassword
        })

        await this.userRepo.save(user);

        return user;
    }

    async jwtFindOne(findData: FindOneOptions<UserEntity>): Promise<UserEntity> {
        const user = await this.userRepo.findOne({
            ...findData,
            relations: ['clinic']
        })

        return user;
    }

    async getUsers(optionsDto: UsersPageOptionsDto): Promise<UsersPageDto> {
        const user = AuthService.getAuthUser();
        console.log('user: ', user);

        const queryBuilder = this.userRepo
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.creator', 'creator')
            .leftJoinAndSelect('user.clinic', 'clinic')
            .leftJoinAndSelect('user.specialty', 'specialty')
            .orderBy(`user.${optionsDto.orderBy}`, optionsDto.order)

        if (optionsDto.name) {
            queryBuilder.andWhere(
                "REPLACE(CONCAT(COALESCE(user.first_name, ''), ' ', COALESCE(user.middle_name, ''), ' ', COALESCE(user.last_name,'')), '  ', ' ') LIKE :fullName",
                { fullName: `%${optionsDto.name}%` },
            );
        }

        if (optionsDto.gender) {
            queryBuilder.andWhere('user.gender = :gender', {
                gender: optionsDto.gender
            })
        }

        if (optionsDto.gender) {
            queryBuilder.andWhere('user.gender = :gender', {
                gender: optionsDto.gender
            })
        }

        if (optionsDto.birthPlace) {
            queryBuilder.searchByString(optionsDto.birthPlace, [
                'user.birthPlace',
            ]);
        }

        if (optionsDto.nation) {
            queryBuilder.searchByString(optionsDto.nation, ['user.nation']);
        }

        if (optionsDto.religion) {
            queryBuilder.searchByString(optionsDto.religion, ['user.religion']);
        }

        if (optionsDto.address) {
            queryBuilder.searchByString(optionsDto.address, ['user.address']);
        }

        if (optionsDto.identityCardNumber) {
            queryBuilder.searchByString(optionsDto.identityCardNumber, [
                'user.identityCardNumber',
            ]);
        }

        if (optionsDto.phone) {
            queryBuilder.searchByString(optionsDto.phone, ['user.phone']);
        }

        if (optionsDto.email) {
            queryBuilder.searchByString(optionsDto.email, ['user.email']);
        }

        if (optionsDto.clinicId) {
            queryBuilder.andWhere(
                'user.clinic = :clinicId', {
                clinicId: optionsDto.clinicId
            })
        }
        if (optionsDto.role && optionsDto.role.length) {
            queryBuilder.andWhere(
                'user.role IN (:role)', {
                role: optionsDto.role
            })
        }

        if (optionsDto.status && optionsDto.status.length) {
            queryBuilder.andWhere(
                'user.status IN (:status)', {
                status: optionsDto.status
            })
        }

        if (optionsDto.clinicIds && optionsDto.clinicIds.length) {
            queryBuilder.andWhere(
                'user.clinic IN (:clinicIds)', {
                clinicIds: optionsDto.clinicIds,
            })
        }

        if (optionsDto.specialtyIds && optionsDto.specialtyIds.length) {
            queryBuilder.andWhere(
                'user.specialty IN (: specialtyIds)', {
                specialtyIds: optionsDto.specialtyIds,
            })
        }

        // Thếu search q
        if (optionsDto.q) {
            queryBuilder
                .andWhere(
                    new Brackets((qb) =>
                        qb
                            .where("REPLACE(CONCAT(COALESCE(user.first_name, ''), ' ', COALESCE(user.middle_name, ''), ' ', COALESCE(user.last_name,'')), '  ', ' ') LIKE :q")
                            .orWhere("user.email LIKE :q")
                            .orWhere("clinic.name LIKE :q")
                            .orWhere("specialty.name LIKE :q")
                            .orWhere("user.phoneNumber LIKE :q")
                    ),
                )
                .setParameter('q', `%${optionsDto.q}%`);
        }

        // console.log(await queryBuilder.getMany());

        const [entities, pageMetaDto] = await queryBuilder.paginate(optionsDto);

        return new UsersPageDto(entities.toDtos(), pageMetaDto);
    }

    async getUserById(userId: string): Promise<UserEntity> {
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['creator', 'clinic', 'specialty']
        });

        if (!user) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.USER_NOT_EXIST,
            );
        }

        return user;
    }

    @Transactional()
    async updateUser(
        userData: UserUpdateDto,
        userId: string,
        file: IFile
    ): Promise<UserEntity> {
        const authUser = AuthService.getAuthUser();
        console.log(authUser);


        let user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['creator', 'clinic', 'specialty']
        })

        if (!user) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.USER_NOT_EXIST
            )
        }
        console.log(userData.role);


        if (userData.role) {
            console.log('abc');

            if (authUser.role == RoleEnum.DOCTOR && userData.role == RoleEnum.ADMIN) {
                throw new ErrorException(
                    HttpStatus.BAD_REQUEST,
                    CodeMessage.ROLE_DOCTOR_NOT_UPDATE_FOR_ROLE_ADMIN
                );
            } else if (authUser.role == RoleEnum.DOCTOR && userData.role == RoleEnum.MANAGER_CLINIC) {
                throw new ErrorException(
                    HttpStatus.BAD_REQUEST,
                    CodeMessage.ROLE_DOCTOR_NOT_UPDATE_FOR_ROLE_MANAGER
                );
            } else if (authUser.role == RoleEnum.MANAGER_CLINIC && userData.role == RoleEnum.ADMIN) {
                throw new ErrorException(
                    HttpStatus.BAD_REQUEST,
                    CodeMessage.ROLE_MANAGER_NOT_UPDATE_FOR_ROLE_ADMIN
                );
            } else if (authUser.role == RoleEnum.USER && userData.role == RoleEnum.ADMIN) {
                throw new ErrorException(
                    HttpStatus.BAD_REQUEST,
                    CodeMessage.ROLE_USER_NOT_UPDATE_FOR_ROLE_ADMIN
                );
            } else if (authUser.role == RoleEnum.USER && userData.role == RoleEnum.MANAGER_CLINIC) {
                throw new ErrorException(
                    HttpStatus.BAD_REQUEST,
                    CodeMessage.ROLE_USER_NOT_UPDATE_FOR_ROLE_MANAGER
                );
            } else if (authUser.role == RoleEnum.USER && userData.role == RoleEnum.DOCTOR) {
                throw new ErrorException(
                    HttpStatus.BAD_REQUEST,
                    CodeMessage.ROLE_USER_NOT_UPDATE_FOR_ROLE_DOCTOR
                );
            } else if (authUser.role == RoleEnum.MANAGER_CLINIC && userData.role == RoleEnum.ADMIN) {
                throw new ErrorException(
                    HttpStatus.BAD_REQUEST,
                    CodeMessage.ROLE_MANAGER_CLINIC_NOT_UPDATE_FOR_ROLE_ADMIN,
                );
            } else if (authUser.role == RoleEnum.MANAGER_CLINIC && userData.role == RoleEnum.ADMIN) {
                throw new ErrorException(
                    HttpStatus.BAD_REQUEST,
                    CodeMessage.ROLE_MANAGER_CLINIC_NOT_UPDATE_FOR_ROLE_ADMIN,
                );
            } else if (authUser.role == RoleEnum.MANAGER_CLINIC && userData.role == RoleEnum.USER) {
                throw new ErrorException(
                    HttpStatus.BAD_REQUEST,
                    CodeMessage.ROLE_MANAGER_CLINIC_NOT_UPDATE_FOR_ROLE_USER,
                );
            }
        }
        if (userData.clinicId) {
            const clinic = await this.clinicRepo.findOne({
                where: { id: userData.clinicId }
            })

            if (!clinic) {
                throw new ErrorException(
                    HttpStatus.NOT_FOUND,
                    CodeMessage.CLINIC_NOT_EXIST
                );
            }
            user.clinic = clinic;
        }

        if (userData.specialtyId) {
            const specialty = await this.specialtyRepo.findOne({
                where: { id: userData.specialtyId }
            });

            if (!specialty) {
                throw new ErrorException(
                    HttpStatus.NOT_FOUND,
                    CodeMessage.SPECIALTY_NOT_EXIST,
                );
            }

            user.specialty = specialty;
        }
        if (file) {
            user.avatar = file.path;
        }

        user = Object.assign(user, userData);
        await this.userRepo.save(user);

        return user;
    }

    @Transactional()
    async deleteUserOne(userId: string): Promise<boolean> {
        const authUser = AuthService.getAuthUser();

        const user = await this.userRepo.findOne({
            where: { id: userId }
        });

        if (!user) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.USER_NOT_EXIST,
            );
        }



        if (authUser.role == RoleEnum.MANAGER_CLINIC && user.role == RoleEnum.ADMIN) {
            throw new ErrorException(
                HttpStatus.BAD_REQUEST,
                CodeMessage.ROLE_MANAGER_CLINIC_NOT_DELETE_FOR_ROLE_ADMIN,
            );
        } else if (authUser.role == RoleEnum.MANAGER_CLINIC && user.role == RoleEnum.USER) {
            throw new ErrorException(
                HttpStatus.BAD_REQUEST,
                CodeMessage.ROLE_MANAGER_CLINIC_NOT_DELETE_FOR_ROLE_USER,
            );
        }

        await this.userRepo.delete(user.id);
        return true;

    }

    @Transactional()
    async changeAvatar(fileInfo: IFile): Promise<UserEntity> {
        const authUser = AuthService.getAuthUser();

        if (!fileInfo) {
            throw new ErrorException(
                HttpStatus.BAD_REQUEST,
                CodeMessage.FILE_CAN_NOT_EMPTY,
            );
        }

        authUser.avatar = fileInfo.path;
        await this.userRepo.save(authUser);
        return authUser;
    }

    async updateStatusUser(dataUpdatseStatus: UserUpdateStatus) {
        const user = await this.userRepo.find({
            select: ['id'],
            where: {
                id: In(dataUpdatseStatus.userIds)
            }
        })

        if (dataUpdatseStatus.userIds.length > user.length) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.USER_NOT_EXIST,
            );
        }

        await this.userRepo.update(
            { id: In(dataUpdatseStatus.userIds) },
            { status: dataUpdatseStatus.status }
        )
        // Different ways
        // await this.userRepo
        //     .createQueryBuilder()
        //     .update('user')
        //     .set({ status: dataUpdatseStatus.status })
        //     .where({ id: In(dataUpdatseStatus.userIds) })
        //     .execute();

        return true;
    }

    async deleteUser(userIds: string[]) {
        const user = await this.userRepo.find({
            select: ['id'],
            where: {
                id: In(userIds)
            }
        })
        if (userIds.length > user.length) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.USER_NOT_EXIST,
            );
        }

        await this.userRepo.delete(userIds);
        // await this.userRepo
        //     .createQueryBuilder()
        //     .delete()
        //     .from('user')
        //     .where({ id: In(userIds) })
        //     .execute();

        return true
    }
}

