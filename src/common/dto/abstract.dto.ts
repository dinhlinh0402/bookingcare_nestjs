import { AbstractEntity } from "../abstract.entity";

export class AbstractDto {
    id: string;
    createdDate: Date;
    lastModifiedDate: Date;

    constructor(entity: AbstractEntity) {
        this.id = entity.id;
        this.createdDate = entity.createdDate;
        this.lastModifiedDate = entity.lastModifiedDate;
    }
}