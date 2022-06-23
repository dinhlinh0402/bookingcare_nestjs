import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CodeMessage } from 'src/common/constants/code-message';
import { Permissions } from 'src/decorators/permission.decorator';
import { ErrorException } from 'src/exceptions/error.exception';
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
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/specialties',
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
                        CodeMessage.ONLY_IMAGE_FILES_ARE_ALLOWED,
                    ),
                    false,
                );
            }
            callback(null, true);
        }
    }))
    async createSpecialty(
        @Body() specialtyCreateDto: SpecialtyCreateDto,
        @UploadedFile() file
    ): Promise<SpecialtyDto> {
        const specialty = await this.specialtyService.createSpecialty(specialtyCreateDto, file)
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
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/specialties',
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
                        CodeMessage.ONLY_IMAGE_FILES_ARE_ALLOWED,
                    ),
                    false,
                );
            }
            callback(null, true);
        }
    }))
    async updateSpecialty(
        @Param('specialtyId') specialtyId: string,
        @Body() specialtyUpdateDto: SpecialtyUpdateDto,
        @UploadedFile() file,
    ): Promise<SpecialtyDto> {
        const specialty = await this.specialtyService.updateSpecialty(specialtyId, specialtyUpdateDto, file);
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
