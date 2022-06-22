import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/decorators/permission.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';
import { AuthUserInterceptor } from 'src/interceptors/auth-user.interceptor';
import { ClinicService } from './clinic.service';
import { ClinicCreateDto, ClinicUpdateDto } from './dto/clinic-data.dto';
import { ClinicPageDto, ClinicPageOptinonsDto } from './dto/clinic-page.dto';
import { ClinicDto } from './dto/clinic.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ErrorException } from 'src/exceptions/error.exception';

@Controller('clinic')
@ApiTags('clinic')
@UseInterceptors(AuthUserInterceptor)
export class ClinicController {
    constructor(private clinicService: ClinicService) { }

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions('admin')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Create clinic',
        type: ClinicDto,
    })
    //Lưu tạm ảnh vào server.
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/clinics',
            filename: (req, file, callback) => {
                const name = file.originalname.split('.')[0];
                const extName = extname(file.originalname);
                const randomName = Array(4)
                    .fill(4)
                    .map(() => Math.floor(Math.random() * 10).toString(10))
                    .join('')
                callback(null, `${name}-${randomName}${extName}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            const mimetypes = [
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/webp',
            ]
            if (!mimetypes.includes(file.mimetype)) {
                return callback(
                    new ErrorException(
                        HttpStatus.BAD_REQUEST,
                        'Only image files are allowed!',
                    ),
                    false,
                );
            }
            callback(null, true);
        }
    }))
    async createClinic(
        @Body() clinicCreateDto: ClinicCreateDto,
        @UploadedFile() file
    ): Promise<ClinicDto> {
        const clinic = await this.clinicService.createClinic(clinicCreateDto, file);
        return clinic.toDto();
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get list clinic',
        type: ClinicPageDto,
    })
    async getClinics(
        @Query(new ValidationPipe({ transform: true }))
        clinicPagesOptionsDto: ClinicPageOptinonsDto
    ): Promise<ClinicPageDto> {
        return await this.clinicService.getClinics(clinicPagesOptionsDto);
    }

    @Get(':clinicId')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get clinic by id',
        type: ClinicDto
    })
    async getClinicById(
        @Param('clinicId') clinicId: string
    ): Promise<ClinicDto> {
        const clinic = await this.clinicService.getClinicById(clinicId);
        return clinic.toDto();
    }

    @Put(':clinicId')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions('admin', 'manager_clinic')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Update clinic',
        type: ClinicDto
    })
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/clinics',
            filename: (req, file, callback) => {
                const name = file.originalname.split('.')[0];
                const extName = extname(file.originalname);
                const randomName = Array(4)
                    .fill(4)
                    .map(() => Math.floor(Math.random() * 10).toString(10))
                    .join('')
                callback(null, `${name}-${randomName}${extName}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            const mimetypes = [
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/webp',
            ]
            if (!mimetypes.includes(file.mimetype)) {
                return callback(
                    new ErrorException(
                        HttpStatus.BAD_REQUEST,
                        'Only image files are allowed!',
                    ),
                    false,
                );
            }
            callback(null, true);
        }
    }))
    async updateClinic(
        @Param('clinicId') clinicId: string,
        @Body() clinicUpdateDto: ClinicUpdateDto,
        @UploadedFile() file
    ): Promise<ClinicDto> {
        const clinic = await this.clinicService.updateClinic(clinicId, clinicUpdateDto, file)
        return clinic.toDto();
    }

    @Delete(':clinicId')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions('admin')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Delete Clinic',
        type: Boolean,
    })
    async deleteClinic(
        @Param('clinicId') clinicId: string
    ): Promise<boolean> {
        return await this.clinicService.deleteClinic(clinicId)
    }
}
