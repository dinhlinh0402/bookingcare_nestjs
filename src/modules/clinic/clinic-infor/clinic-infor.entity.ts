import { AbstractEntity } from "src/common/abstract.entity";
import { SpecialtyEntity } from "src/modules/specialty/specialty.entity";
import { UserEntity } from "src/modules/user/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne } from "typeorm";
import { ClinicEntity } from "../clinic.entity";
import { ClinicInforDto } from "./dto/clinic-infor.dto";

@Entity({ name: 'clinic_infor' })
export class ClinicInforEntity extends AbstractEntity<ClinicInforDto> {
    @Column({ type: 'longtext', comment: 'Giới thiệu' })
    introduct: string;

    @Column({ nullable: true, type: 'longtext', comment: 'Thế mạnh' })
    strengths: string;

    @Column({ nullable: true, type: 'longtext', comment: 'Trang thiết bị' })
    equipment: string;

    @Column({ nullable: true, type: 'longtext', comment: 'Vị trí' })
    location: string;

    @Column({ nullable: true, type: 'longtext', comment: 'Quy trình' })
    procedure: string;

    @OneToOne(() => ClinicEntity, {
        onDelete: 'CASCADE'
    })
    // @JoinColumn()
    clinic: ClinicEntity;

    @Column({ type: 'varchar', nullable: true, length: 36 })
    clinicId: string;

    @ManyToOne(() => UserEntity)
    creator: UserEntity;

    dtoClass = ClinicInforDto;

}