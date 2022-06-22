import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/decorators/permission.decorator';
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
    async createUser(@Body() userCreateDto: UserCreateDto): Promise<UserDto> {
        // console.log(userCreateDto);
        const user = await this.userService.createUser(userCreateDto)
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
    async updateUser(
        @Body() userUpdateDto: UserUpdateDto,
        @Param('userId') userId: string
    ): Promise<UserDto> {
        const user = await this.userService.updateUser(userUpdateDto, userId);
        return user.toDto();
    }

}
