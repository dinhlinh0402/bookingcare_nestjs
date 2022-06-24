import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/decorators/permission.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';
import { AuthUserInterceptor } from 'src/interceptors/auth-user.interceptor';
import { SchedulePageDto, SchedulePageOptionsDto } from './dto/schdule-page.dto';
import { ScheduleCreateDto, ScheduleUpdateDto } from './dto/schedule-data.dto';
import { ScheduleDto } from './dto/schedule.dto';

@Controller('schedules')
@ApiTags('schedules')
@UseInterceptors(AuthUserInterceptor)
export class SchedulesController {

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
    async createSchedules(
        @Body() scheduleCreateDto: ScheduleCreateDto
    ) {

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
    ) {

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
    ) {

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
    ) {

    }


}
