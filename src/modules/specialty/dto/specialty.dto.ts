import { ApiPropertyOptional } from "@nestjs/swagger";
import { AbstractDto } from "src/common/dto/abstract.dto";
import { UserDto } from "src/modules/user/dto/user.dto";
import { SpecialtyEntity } from "../specialty.entity";

export class SpecialtyDto extends AbstractDto {
    @ApiPropertyOptional()
    name: string;

    @ApiPropertyOptional()
    image: string;

    @ApiPropertyOptional()
    description: string;

    @ApiPropertyOptional({ type: () => UserDto })
    creator: UserDto;

    constructor(entity: SpecialtyEntity) {
        super(entity);

        this.name = entity.name;
        this.image = entity.image;
        this.description = entity.description;

        if (entity.creator) {
            this.creator = entity.creator;
        }
    }
}