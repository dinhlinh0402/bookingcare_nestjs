import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isThisMonth } from 'date-fns/esm';
import { RequestContext } from 'src/providers/request-context.service';
import { UtilsService } from 'src/providers/util.service';
import { ConfigService } from 'src/shared/service/config.service';
import { sendMail } from 'src/utils/sendMail.util';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CodeMessage } from '../../common/constants/code-message';
import { ErrorException } from '../../exceptions/error.exception';
import { UserDto } from '../user/dto/user.dto';
import { resetPasswordSubject, resetPasswordTemplate } from '../user/mail.template';
import { UserEntity } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { UserService } from '../user/user.service';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { UserChangePasswordDto, UserResetPasswordDto } from './dto/user-change-password.dto';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
    private static readonly authUserKey = 'user_key';

    constructor(
        private userService: UserService,
        private configService: ConfigService,
        private jwtService: JwtService,
        private userRepo: UserRepository,
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

        return user;
    }

    @Transactional()
    async userChangePassword(userChangePassword: UserChangePasswordDto): Promise<UserEntity> {
        const authUser = AuthService.getAuthUser();

        if (userChangePassword.newPassword !==
            userChangePassword.confirmPassword) {
            throw new ErrorException(
                HttpStatus.BAD_REQUEST,
                CodeMessage.NEW_PASSWORD_AND_CONFIRM_PASSWORD_NOT_MATCH,
            )
        }

        const isPasswordValid = await UtilsService.validateHash(userChangePassword.currentPassword, authUser.password);

        // console.log('isPasswordValid', isPasswordValid);

        if (!isPasswordValid) {
            throw new ErrorException(
                HttpStatus.BAD_REQUEST,
                CodeMessage.CURRENT_PASSWORD_INVALID
            )
        }

        const newPassword = UtilsService.generateHash(userChangePassword.newPassword);
        authUser.password = newPassword;
        await this.userRepo.save(authUser);
        return authUser;
    }

    @Transactional()
    async resetPasswordViaMail(userResetPasswordDto: UserResetPasswordDto): Promise<UserEntity> {
        const user = await this.userRepo.findOne({
            where: {
                email: userResetPasswordDto.email,
            }
        });

        if (!user) {
            throw new ErrorException(
                HttpStatus.NOT_FOUND,
                CodeMessage.USER_NOT_EXIST,
            );
        }

        const password = Array(8)
            .fill(null)
            .map(() => Math.floor(Math.random() * 10).toString(10))
            .join('')

        const hashPassword = UtilsService.generateHash(password);
        user.password = hashPassword;
        await this.userRepo.save(user);

        const { lastName, email } = user;
        const mailContent = resetPasswordTemplate(
            lastName,
            password,
            email,
        );

        try {
            await sendMail(email, resetPasswordSubject, mailContent)
        } catch (error) {
            // console.log(error);
            throw new ErrorException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                CodeMessage.CAN_NOT_SEND_MAIL_TO_USER,
            );
        }

        return user;

    }

    static setAuthUser(user: UserEntity) {
        RequestContext.set(this.authUserKey, user)
    }

    static getAuthUser(): UserEntity {
        return RequestContext.get(this.authUserKey)
    }
}
