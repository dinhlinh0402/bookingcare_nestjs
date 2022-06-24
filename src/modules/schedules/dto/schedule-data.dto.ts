import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsUUID, ValidateNested } from "class-validator";

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
    @ApiProperty({
        type: [ScheduleTime],
        description: 'Schedule times'
    })
    @Type(() => ScheduleTime)
    @ValidateNested({ each: true })
    @IsArray()
    times: ScheduleTime[];
}