import { Exclude } from "class-transformer";
import { UtilsService } from "src/providers/util.service";
import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AbstractDto } from "./dto/abstract.dto";

export abstract class AbstractEntity<T extends AbstractDto = AbstractDto> {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ name: 'created_date' })
    createdDate: Date;

    @UpdateDateColumn({ name: 'last_modified_date' })
    lastModifiedDate: Date;

    @DeleteDateColumn()
    deleteAt: Date;

    @Exclude()
    abstract dtoClass: new (entity: AbstractEntity, options?: any) => T;

    toDto(options?: any) {
        return UtilsService.toDto(this.dtoClass, this, options);
    }
}