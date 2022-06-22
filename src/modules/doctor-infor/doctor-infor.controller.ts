import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/decorators/permission.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';
import { AuthUserInterceptor } from 'src/interceptors/auth-user.interceptor';
import { DoctorInforService } from './doctor-infor.service';
import { DoctorInforCreateDto, DoctorInforUpdateDto } from './dto/doctor-infor-data.dto';
import { DoctorInforDto } from './dto/doctor-infor.dto';

@Controller('doctor-infor')
@ApiTags('doctor')
@ApiBearerAuth()
@UseInterceptors(AuthUserInterceptor)
export class DoctorInforController {
    constructor(
        private doctorInforService: DoctorInforService,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions('admin', 'manager_clinic', 'doctor')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Create doctor infor',
        type: DoctorInforDto
    })
    async createDoctorInfor(
        @Body() doctorInforCreateDto: DoctorInforCreateDto,
    ): Promise<DoctorInforDto> {
        const doctorInfor = await this.doctorInforService.createDoctorInfor(doctorInforCreateDto)
        return doctorInfor.toDto();
    }

    @Get(':doctorInforId')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get doctor infor by id',
        type: DoctorInforDto
    })
    async getDoctorInforById(
        @Param('doctorInforId') doctorInforId: string
    ): Promise<DoctorInforDto> {
        const doctorInfor = await this.doctorInforService.getDoctorInforById(doctorInforId)
        return doctorInfor.toDto();
    }

    @Put(':doctorInforId')
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions('admin', 'manager_clinic', 'doctor')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Update doctor infor by id',
        type: DoctorInforDto
    })
    async updateDoctorInfor(
        @Body() doctorInforUpdateDto: DoctorInforUpdateDto,
        @Param('doctorInforId') doctorInforId: string
    ) { //: Promise<DoctorInforDto>
        const doctorInfor = await this.doctorInforService.updateDoctorInfor(
            doctorInforUpdateDto,
            doctorInforId
        )
        return doctorInfor.toDto();
    }

    @Delete(':doctorInforId')
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions('admin', 'manager_clinic', 'doctor')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'delete doctor infor by id',
        type: Boolean,
    })
    async deleteDoctorInfor(
        @Param('doctorInforId') doctorInforId: string
    ): Promise<boolean> {
        return await this.doctorInforService.deleteDoctorInfor(doctorInforId)
    }
}
