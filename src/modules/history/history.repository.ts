import { EntityRepository, Repository } from "typeorm";
import { HistoryEntity } from "./history.entity";

@EntityRepository(HistoryEntity)
export class HistoryRepository extends Repository<HistoryEntity> {}