import { AbstractEntity } from "../../common/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, Timestamp } from "typeorm";
import { UserDto } from "./dto/user.dto";
import { GenderEnum } from "../../common/constants/gender";
import { RoleEnum } from "src/common/constants/role";
import { ClinicEntity } from "../clinic/clinic.entity";
import { DoctorInforEntity } from "../doctor-infor/doctor-infor.entity";
import { SpecialtyEntity } from "../specialty/specialty.entity";

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto> {

    @Column({ unique: true, nullable: false })
    email: string;

    @Column()
    password: string;

    @Column()
    firstName: string;

    @Column({ nullable: true })
    middleName: string;

    @Column()
    lastName: string;

    @Column({ nullable: true, type: 'enum', enum: GenderEnum })
    gender: string;

    @Column({ nullable: true })
    birthday: Date;

    @Column({ type: 'longtext', nullable: true })
    birthPlace: string;

    @Column({ nullable: true })
    nation: string;

    @Column({ nullable: true })
    religion: string;

    @Column({ nullable: true })
    identityCardNumber: string;

    @Column({ nullable: true })
    identityCardDate: Date;

    @Column({ nullable: true })
    identityCardPlace: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    phoneNumber: string;

    @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.USER })
    role: RoleEnum;

    @Column({ nullable: true })
    avatar: string;

    @OneToOne(() => DoctorInforEntity)
    @JoinColumn()
    doctorInfor: DoctorInforEntity;

    @ManyToOne(() => ClinicEntity, {
        onDelete: 'SET NULL'
    })
    // @JoinColumn({ name: 'clinic_id' })
    clinic: ClinicEntity;

    // @Column({ nullable: true, type: 'varchar', length: 36 })
    // clinicId: string

    @ManyToOne(() => SpecialtyEntity, {
        onDelete: 'SET NULL'
    })
    specialty: SpecialtyEntity

    @ManyToOne(() => UserEntity)
    creator: UserEntity;

    dtoClass = UserDto;
}

export const newUserEntity = (user: Partial<UserEntity>) =>
    Object.assign(new UserEntity(), user);

