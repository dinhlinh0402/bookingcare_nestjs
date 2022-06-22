import { AbstractEntity } from "src/common/abstract.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { SpecialtyDto } from "./dto/specialty.dto";


@Entity({ name: 'specialties' })
export class SpecialtyEntity extends AbstractEntity<SpecialtyDto> {
    @Column()
    name: string;

    @Column()
    image: string;

    @Column({ type: "longtext" })
    description: string;

    @ManyToOne(() => UserEntity)
    creator: UserEntity;

    dtoClass = SpecialtyDto;
}