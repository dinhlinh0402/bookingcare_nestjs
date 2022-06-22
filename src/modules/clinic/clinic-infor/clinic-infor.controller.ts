import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/decorators/permission.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';
import { AuthUserInterceptor } from 'src/interceptors/auth-user.interceptor';
import { ClinicInforService } from './clinic-infor.service';
import { ClinicInforCreateDto, ClinicInforUpdateDto } from './dto/clinic-infor-data.dto';
import { ClinicInforDto } from './dto/clinic-infor.dto';

@Controller('clinic-infor')
@ApiTags('clinic')
@UseInterceptors(AuthUserInterceptor)
export class ClinicInforController {
    constructor(
        private clinicInforService: ClinicInforService,
    ) { }

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions('admin', 'manager_clinic')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Create clinic infor',
        type: ClinicInforDto,
    })
    async createClinicInfor(
        @Body() clinicInforCreateDto: ClinicInforCreateDto
    ): Promise<ClinicInforDto> {
        const clinicInfor = await this.clinicInforService.createClinicInfor(clinicInforCreateDto);
        return clinicInfor.toDto();
    }

    @Get(':clinicInforId')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get clinc infor by id',
        type: ClinicInforDto
    })
    async getClinicById(
        @Param('clinicInforId') clinicInforId: string
    ): Promise<ClinicInforDto> {
        const clinicInfor = await this.clinicInforService.getClinicById(clinicInforId);
        return clinicInfor.toDto();
    }

    @Put(':clinicInforId')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions('admin', 'manager_clinic')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Update clinic infor',
        type: Boolean,
    })
    async updateClinicInfor(
        @Param('clinicInforId') clinicInforId: string,
        @Body() clinicInforUpdateDto: ClinicInforUpdateDto
    ): Promise<ClinicInforDto> {
        const clinicInfor = await this.clinicInforService.updateClinicInfor(clinicInforId, clinicInforUpdateDto);
        return clinicInfor.toDto();
    }

    @Delete(':clinicInforId')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions('admin', 'manager_clinic')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Delete clinic infor',
        type: Boolean,
    })
    async deleteClinicInfor(
        @Param('clinicInforId') clinicInforId: string
    ): Promise<boolean> {
        return await this.clinicInforService.deleteClinicInfor(clinicInforId);
    }

}
