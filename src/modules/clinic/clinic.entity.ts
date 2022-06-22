import { AbstractEntity } from "src/common/abstract.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne } from "typeorm";
import { SpecialtyEntity } from "../specialty/specialty.entity";
import { UserEntity } from "../user/user.entity";
import { ClinicInforEntity } from "./clinic-infor/clinic-infor.entity";
import { ClinicDto } from "./dto/clinic.dto";

@Entity({ name: 'clinics' })
export class ClinicEntity extends AbstractEntity<ClinicDto> {

    @Column({ type: 'longtext' })
    name: string;

    @Column({ type: 'longtext', nullable: true })
    address: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({ nullable: true })
    image: string;

    @Column({ default: false })
    active: boolean;

    @OneToOne(() => ClinicInforEntity)
    @JoinColumn()
    clinicInfor: ClinicInforEntity;

    @ManyToMany(() => SpecialtyEntity)
    @JoinTable()
    specialties: SpecialtyEntity[];

    @ManyToOne(() => UserEntity)
    // // @JoinColumn()
    creator: UserEntity;

    dtoClass = ClinicDto;
}