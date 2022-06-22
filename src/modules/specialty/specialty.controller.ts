import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/decorators/permission.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';
import { AuthUserInterceptor } from 'src/interceptors/auth-user.interceptor';
import { SpecialtyCreateDto, SpecialtyUpdateDto } from './dto/specialty-data';
import { SpecialtyPageDto, SpecialtyPageOptionsDto } from './dto/specialty-page';
import { SpecialtyDto } from './dto/specialty.dto';
import { SpecialtyService } from './specialty.service';

@Controller('specialty')
@ApiTags('specialty')
@UseInterceptors(AuthUserInterceptor)
export class SpecialtyController {
    constructor(
        private specialtyService: SpecialtyService
    ) { }

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions('admin')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Create Specialty',
        type: SpecialtyDto
    })
    async createSpecialty(
        @Body() specialtyCreateDto: SpecialtyCreateDto
    ): Promise<SpecialtyDto> {
        const specialty = await this.specialtyService.createSpecialty(specialtyCreateDto)
        return specialty.toDto();
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get list of specialty',
        type: SpecialtyPageDto,
    })
    async getSpecialties(
        @Query(new ValidationPipe({ transform: true }))
        specialtyPageOptionsDto: SpecialtyPageOptionsDto
    ): Promise<SpecialtyPageDto> {
        return await this.specialtyService.getSpecialties(specialtyPageOptionsDto);
    }

    @Get(':specialtyId')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get specialty by id',
        type: SpecialtyDto,
    })
    async getSpecialtyById(
        @Param('specialtyId') specialtyId: string
    ): Promise<SpecialtyDto> {
        const specialty = await this.specialtyService.getSpecialtyById(specialtyId);
        return specialty.toDto();
    }

    @Put(':specialtyId')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions('admin')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Update Specialty',
        type: SpecialtyDto,
    })
    async updateSpecialty(
        @Param('specialtyId') specialtyId: string,
        @Body() specialtyUpdateDto: SpecialtyUpdateDto
    ): Promise<SpecialtyDto> {
        console.log(specialtyId);

        const specialty = await this.specialtyService.updateSpecialty(specialtyId, specialtyUpdateDto);
        return specialty;
    }

    @Delete(':specialtyId')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions('admin')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Delete Specialty',
        type: Boolean,
    })
    async deleteSpecialty(
        @Param('specialtyId') specialtyId: string
    ): Promise<boolean> {
        return await this.specialtyService.deleteSpecialty(specialtyId);
    }

}
