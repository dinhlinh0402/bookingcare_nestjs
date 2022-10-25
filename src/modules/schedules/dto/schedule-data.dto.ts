import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUUID, Min, ValidateNested } from "class-validator";

export class ScheduleTime {
    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    timeStart: Date;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    timeEnd: Date;
}

export class ScheduleCreateDto {
    @IsUUID('4')
    @IsNotEmpty()
    @ApiProperty()
    doctorId: string;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    date: Date;

    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    @Type(() => Number)
    @ApiProperty()
    maxCount: number;

    @ApiProperty({
        type: [ScheduleTime],
        description: 'Schedule times'
    })
    @Type(() => ScheduleTime)
    @ValidateNested({ each: true })
    @IsArray()
    times: ScheduleTime[];
}

export class ScheduleUpdateDto {
    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    date: Date;

    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    @Type(() => Number)
    @ApiProperty()
    maxCount: number;

    @ApiProperty({
        type: [ScheduleTime],
        description: 'Schedule times'
    })
    @Type(() => ScheduleTime)
    @ValidateNested({ each: true })
    @IsArray()
    times: ScheduleTime[];
}