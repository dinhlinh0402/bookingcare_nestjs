import { EntityRepository, Repository } from "typeorm";
import { DoctorInforEntity } from "./doctor-infor.entity";

@EntityRepository(DoctorInforEntity)
export class DoctorInforRepository extends Repository<DoctorInforEntity> { }