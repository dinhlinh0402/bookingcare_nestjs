import { EntityRepository, Repository } from "typeorm";
import { BookingEntity, BookingRelativesEntity } from "./booking.entity";

@EntityRepository(BookingEntity)
export class BookingRepository extends Repository<BookingEntity> { }

@EntityRepository(BookingRelativesEntity)
export class BookingRelativesRepository extends Repository<BookingRelativesEntity> { }