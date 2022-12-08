import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CodeMessage } from 'src/common/constants/code-message';
import { Permissions } from 'src/decorators/permission.decorator';
import { ErrorException } from 'src/exceptions/error.exception';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';
import { AuthUserInterceptor } from 'src/interceptors/auth-user.interceptor';
import { UserCreateDto, UserDelete, UserUpdateDto, UserUpdateStatus } from './dto/user-data.dto';
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
    @Permissions('admin', 'manager_clinic', 'HEAD_OF_DOCTOR')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get list user paging',
        type: UsersPageDto,
    })
    async getUsers(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: UsersPageOptionsDto
    ): Promise<UsersPageDto> {
        // console.log('pageOptionsDto', pageOptionsDto);
        return this.userService.getUsers(pageOptionsDto)
    }

    @Get(':userId')
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions('admin', 'manager_clinic')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get user by id',
        type: UserDto,
    })
    async getUserById(
        @Param('userId') userId: string
    ): Promise<UserDto> {
        const user = await this.userService.getUserById(userId);
        return user.toDto();
    }

    @Put('change-status')
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Update status user, admin, manager clinic, doctor',
        type: Boolean
    })

    async updateStatusUser(
        @Body() userUpdateStatusDto: UserUpdateStatus,
    ): Promise<boolean> {
        return await this.userService.updateStatusUser(userUpdateStatusDto);
    }



    @Put(':userId')
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions('admin', 'manager_clinic', 'HEAD_OF_DOCTOR')
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

    @Delete()
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions('admin', 'manager_clinic', 'HEAD_OF_DOCTOR')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: 200,
        description: 'Delete many user',
        type: Boolean,
    })
    async deleteUser(
        @Body() dataUser: UserDelete,
        // @Param('userId') userId: string
    ): Promise<boolean> {
        return await this.userService.deleteUser(dataUser.userIds);
    }

    // @Delete(':userId')
    // @UseGuards(JwtAuthGuard, PermissionGuard)
    // @Permissions('admin', 'manager_clinic')
    // @HttpCode(HttpStatus.OK)
    // @ApiResponse({
    //     status: 200,
    //     description: 'Delete user',
    //     type: Boolean,
    // })
    // async deleteUser(
    //     @Param('userId') userId: string
    // ): Promise<boolean> {
    //     return await this.userService.deleteUser(userId);
    // }

    @Post('change-avatar')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthUserInterceptor)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Change avatar',
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
    async changeAvatar(
        @UploadedFile() file
    ): Promise<UserDto> {
        const user = await this.userService.changeAvatar(file);
        return user;
    }
}
