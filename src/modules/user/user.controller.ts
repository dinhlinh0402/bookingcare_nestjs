import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
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
import { UserCreateDto, UserUpdateDto } from './dto/user-data.dto';
import { UsersPageDto, UsersPageOptionsDto } from './dto/user-page.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
@UseInterceptors(AuthUserInterceptor)
export class UserController {
    constructor(private userService: UserService) { }

    // Create account for admin, manager clinic, doctor
    @Post()
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions('admin', 'manager_clinic')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Create user',
        type: UserDto
    })
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/avatars',
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
    async createUser(
        @Body() userCreateDto: UserCreateDto,
        @UploadedFile() file
    ): Promise<UserDto> {
        // console.log(userCreateDto);
        const user = await this.userService.createUser(userCreateDto, file)
        return user.toDto();
    }

    @Get()
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions('admin', 'manager_clinic')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get list user paging',
        type: UsersPageDto,
    })
    async getUsers(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: UsersPageOptionsDto
    ) {
        console.log(pageOptionsDto);
        return this.userService.getUsers(pageOptionsDto)
    }

    @Put(':userId')
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Update user, admin, manager clinic, doctor',
        type: UserDto,
    })
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/avatars',
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
    async updateUser(
        @Body() userUpdateDto: UserUpdateDto,
        @Param('userId') userId: string,
        @UploadedFile() file
    ): Promise<UserDto> {
        const user = await this.userService.updateUser(userUpdateDto, userId, file);
        return user.toDto();
    }

}
