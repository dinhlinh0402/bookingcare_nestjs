import * as format from "string-format";
import { Brackets, QueryBuilder, SelectQueryBuilder } from "typeorm";
import { AbstractEntity } from "./common/abstract.entity";
import { AbstractDto } from "./common/dto/abstract.dto";
import { PageMetaDto } from "./common/dto/page-meta.dto";
import { PageOptionsDto } from "./common/dto/page-options.dto";
import { UserEntity } from "./modules/user/user.entity";

format.extend(String.prototype, {});
declare global {
    interface String {
        format(...args: any[]): string;
    }
}

// declare module 'socket.io' {
//   interface Socket {
//     user: UserEntity;
//   }
// }

declare global {
    interface Array<T> {
        toDtos<B extends AbstractDto>(this: AbstractEntity<B>[]): B[];
    }
}

declare module 'typeorm' {
    interface QueryBuilder<Entity> {
        searchByString(q: string, columnNames: string[]): this;
    }

    interface SelectQueryBuilder<Entity> {
        paginate(
            this: SelectQueryBuilder<Entity>,
            pageOptionsDto: PageOptionsDto,
        ): Promise<[Entity[], PageMetaDto]>;
    }
}

Array.prototype.toDtos = function <B extends AbstractDto>(options?: any): B[] {
    return (this as Array<AbstractEntity>)
        .map((item: { toDto: (arg0: any) => any }) => item.toDto(options))
        .filter(Boolean) as B[];
};

QueryBuilder.prototype.searchByString = function (q, columnNames) {
    this.andWhere(
        new Brackets((qb) => {
            for (const item of columnNames) {
                qb.orWhere(`${item} LIKE :q`);
            }
        }),
    );

    this.setParameter('q', `%${q}%`);

    return this;
};

SelectQueryBuilder.prototype.paginate = async function <Entity>(
    this: SelectQueryBuilder<Entity>,
    pageOptionsDto: PageOptionsDto,
): Promise<[Entity[], PageMetaDto]> {
    const [items, itemCount] = await this.skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take)
        .getManyAndCount();

    const pageMetaDto = new PageMetaDto({
        itemCount,
        pageOptionsDto,
    });

    return [items, pageMetaDto];
};
