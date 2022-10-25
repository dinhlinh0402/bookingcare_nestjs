import { AbstractEntity } from "src/common/abstract.entity";
import { DoctorInforPayment, DoctorInforPosition } from "src/common/constants/doctor-infor.enum";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { DoctorInforDto } from "./dto/doctor-infor.dto";

@Entity({ name: 'doctor_infor' })
export class DoctorInforEntity extends AbstractEntity<DoctorInforDto> {
    @Column({ nullable: true, type: 'longtext', comment: 'chi tiết về bác sĩ' })
    description: string;

    @Column()
    price: number;

    @Column({ nullable: true, type: 'longtext', comment: 'Giới thiệu qua về bác sĩ' })
    introduct: string;

    // @Column({ default: 0, comment: 'Số người đã khám' })
    // count: number;

    @Column({ nullable: true, type: 'enum', enum: DoctorInforPayment })
    payment: DoctorInforPayment;

    @Column({ type: 'enum', enum: DoctorInforPosition, default: DoctorInforPosition.DOCTOR })
    position: DoctorInforPosition;

    @Column({ nullable: true })
    note: string;

    // @OneToOne(() => UserEntity, {
    //     onDelete: 'CASCADE'
    // })
    // @JoinColumn()
    // doctor: UserEntity;

    // @Column({ type: 'varchar', nullable: true, length: 36 })
    // doctorId: string;

    @ManyToOne(() => UserEntity)
    creator: UserEntity;

    dtoClass = DoctorInforDto;
}