import { EntityRepository, Repository } from "typeorm";
import { SpecialtyEntity } from "./specialty.entity";

@EntityRepository(SpecialtyEntity)
export class SpecialtyRepository extends Repository<SpecialtyEntity>{ }