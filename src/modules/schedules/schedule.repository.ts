import { EntityRepository, Repository } from "typeorm";
import { ScheduleEntity } from "./schedule.entity";

@EntityRepository(ScheduleEntity)
export class ScheduleRepository extends Repository<ScheduleEntity> { }