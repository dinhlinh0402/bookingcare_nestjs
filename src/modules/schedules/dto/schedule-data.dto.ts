import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsDate, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsUUID, ValidateNested } from "class-validator";

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

    @ApiProperty({
        type: [ScheduleTime],
        description: 'Schedule times'
    })
    @Type(() => ScheduleTime)
    @ValidateNested({ each: true })
    @IsArray()
    times: ScheduleTime[];
}