import { EntityRepository, Repository } from "typeorm";
import { ClinicEntity } from "./clinic.entity";

@EntityRepository(ClinicEntity)
export class ClinicRepository extends Repository<ClinicEntity> { }