import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";
import { Order, OrderBy } from "../constants/order.enum";


export class PageOptionsDto {
    @ApiPropertyOptional({
        enum: OrderBy,
        default: OrderBy.CREATE_DATE,
    })
    @IsEnum(OrderBy)
    @IsOptional()
    readonly orderBy: OrderBy = OrderBy.CREATE_DATE;

    @ApiPropertyOptional({
        enum: Order,
        default: Order.DESC,
    })
    @IsEnum(Order)
    @IsOptional()
    readonly order: Order = Order.DESC;

    @ApiPropertyOptional({
        minimum: 1,
        default: 1,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    readonly page: number = 1;

    @ApiPropertyOptional({
        minimum: 1,
        maximum: 100,
        default: 10,
    })
    @Type(() => Number)
    @IsInt()
    @Min(10)
    @Max(100)
    @IsOptional()
    readonly take: number = 10;

    @ApiPropertyOptional()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    q?: string;

    get skip(): number {
        return (this.page - 1) * this.take;
    }
}