import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestContext } from 'src/providers/request-context.service';
import { UtilsService } from 'src/providers/util.service';
import { ConfigService } from 'src/shared/service/config.service';
import { CodeMessage } from '../../common/constants/code-message';
import { ErrorException } from '../../exceptions/error.exception';
import { UserDto } from '../user/dto/user.dto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
    private static readonly authUserKey = 'user_key';

    constructor(
        private userService: UserService,
        private configService: ConfigService,
        private jwtService: JwtService,
    ) { }

    async createToken(user: UserEntity | UserDto): Promise<TokenPayloadDto> {
        return new TokenPayloadDto({
            expiresIn: this.configService.getNumber('JWT_EXPIRATION_TIME'),
            accessToken: await this.jwtService.signAsync({ id: user.id }),
        })
    }

    async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
        const user = await this.userService.jwtFindOne({
            where: {
                email: userLoginDto.email
            }
        })
        // console.log(user);
        if (!user) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.USER_NOT_EXIST
            )
        }

        const isPassword = await UtilsService.validateHash(
            userLoginDto.password,
            user.password
        );

        if (user && !isPassword) {
            throw new ErrorException(
                HttpStatus.BAD_REQUEST,
                CodeMessage.PASSWORD_NOT_MATCH
            )
        }
        console.log(isPassword);

        return user;
    }

    static setAuthUser(user: UserEntity) {
        RequestContext.set(this.authUserKey, user)
    }

    static getAuthUser(): UserEntity {
        return RequestContext.get(this.authUserKey)
    }
}
