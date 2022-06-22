import { Body, Controller, HttpCode, HttpStatus, Post, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/decorators/permission.decorator';
import { AuthUserInterceptor } from 'src/interceptors/auth-user.interceptor';
import { UserService } from '../user/user.service';
import { DoctorService } from './doctor.service';
import { DoctorCreateDto } from './dto/doctor-data.dto';
import { DoctorDto } from './dto/doctor.dto';

@Controller('doctor')
@ApiTags('doctor')
export class DoctorController {
    constructor(
        private doctorService: DoctorService,
        private userService: UserService,
    ) { }

    // Create new a doctor by manager_clinic 
    @Post()
    @ApiBearerAuth()
    @UseInterceptors(AuthUserInterceptor)
    @Permissions('manager_clinic')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Create new a doctor by manager clinic',
        type: DoctorDto,
    })
    async createDoctor(
        @Body() doctorCreateDto: DoctorCreateDto
    ): Promise<DoctorDto> {
        console.log('doctorCreateDto: ', doctorCreateDto);
        const doctor = await this.userService.createUser(doctorCreateDto);
        return doctor.toDto();
    }
}
