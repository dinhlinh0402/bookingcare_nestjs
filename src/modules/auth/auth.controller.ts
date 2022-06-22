import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AuthUserInterceptor } from 'src/interceptors/auth-user.interceptor';
import { UserDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        public readonly authService: AuthService,
        public readonly userService: UserService
    ) { }

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: LoginPayloadDto,
        description: 'User info with access token'
    })
    async userLogin(
        @Body() userLoginDto: UserLoginDto,
    ): Promise<LoginPayloadDto> {
        //77117446
        console.log(userLoginDto);
        const userEntity = await this.authService.validateUser(userLoginDto);
        console.log(userEntity);

        console.log(userEntity);

        const token = await this.authService.createToken(userEntity);
        console.log(token);

        return new LoginPayloadDto(userEntity.toDto(), token)

    }

    // For User
    @Post('register')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: UserDto,
        description: 'Successfully registered',
    })
    async userRegister(
        @Body() userRegisterDto: UserRegisterDto
    ): Promise<UserDto> {
        const createdUser = await this.userService.register(userRegisterDto);
        return createdUser.toDto();
    }

    // For manager clinic // for doctor

    @Get('me')
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthUserInterceptor)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: UserDto,
        description: 'Current user infor',
    })
    getCurrentUser() {
        const authUser = AuthService.getAuthUser();

        return authUser.toDto();
    }
}
