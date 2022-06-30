import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/decorators/permission.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';
import { AuthUserInterceptor } from 'src/interceptors/auth-user.interceptor';
import { SchedulePageDto, SchedulePageOptionsDto } from './dto/schdule-page.dto';
import { ScheduleCreateDto, ScheduleUpdateDto } from './dto/schedule-data.dto';
import { ScheduleDto } from './dto/schedule.dto';
import { SchedulesService } from './schedule.service';

@Controller('schedules')
@ApiTags('schedules')
@UseInterceptors(AuthUserInterceptor)
export class SchedulesController {
    constructor(
        private scheduleService: SchedulesService,
    ) { }

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions('admin', 'manager_clinic', 'doctor')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Create schedules for doctor',
        type: [ScheduleDto]
    })
    async createSchedule(
        @Body() scheduleCreateDto: ScheduleCreateDto
    ): Promise<ScheduleDto[]> {
        const schedules = await this.scheduleService.createSchedule(scheduleCreateDto);
        return schedules;
    }

    //update report-work
    @Put(':doctorId')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions('admin', 'manager_clinic', 'doctor')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Update schedules for doctor',
        type: [ScheduleDto]
    })
    async updateSchedule(
        @Param('doctorId') doctorId: string,
        @Body() scheduleUpdateDto: ScheduleUpdateDto
    ): Promise<ScheduleDto[]> {
        const schedules = await this.scheduleService.updateSchedule(scheduleUpdateDto, doctorId);
        return schedules;
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get list schedules by doctor id',
        type: SchedulePageDto
    })
    async getListSchedule(
        @Query(new ValidationPipe({ transform: true }))
        schedulePageOptionsDto: SchedulePageOptionsDto
    ): Promise<SchedulePageDto> {
        return await this.scheduleService.getSchedules(schedulePageOptionsDto)
    }

    @Get(':scheduleId')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get list schedules by doctor id',
        type: ScheduleDto
    })
    async getScheduleById(
        @Param('scheduleId') scheduleId: string
    ): Promise<ScheduleDto> {
        const schedule = await this.scheduleService.getScheduleById(scheduleId);
        return schedule.toDto();
    }

    @Delete(':scheduleId')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions('admin', 'manager_clinic', 'doctor')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Delete schedules for doctor',
        type: Boolean
    })
    async deleteSchedule(
        @Param('scheduleId') scheduleId: string
    ): Promise<boolean> {
        return await this.scheduleService.deleteSchedule(scheduleId)
    }


}
