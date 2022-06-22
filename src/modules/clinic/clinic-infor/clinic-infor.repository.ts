import { EntityRepository, Repository } from "typeorm";
import { ClinicInforEntity } from "./clinic-infor.entity";

@EntityRepository(ClinicInforEntity)
export class ClinicInforRepository extends Repository<ClinicInforEntity> { }