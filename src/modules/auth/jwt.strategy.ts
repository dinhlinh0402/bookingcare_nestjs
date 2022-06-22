import { HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { CodeMessage } from "src/common/constants/code-message";
import { ErrorException } from "src/exceptions/error.exception";
import { ConfigService } from "src/shared/service/config.service";
import { UserService } from "../user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService, configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET_KEY'),
        })
    }

    async validate({ iat, exp, id: userId }) {
        const timeDiff = exp - iat;
        if (timeDiff < 0) {
            throw new ErrorException(
                HttpStatus.UNAUTHORIZED,
                CodeMessage.UNAUTHORIZED
            );
        }
        const user = await this.userService.jwtFindOne({
            where: { id: userId }
        });

        if (!user) {
            throw new ErrorException(
                HttpStatus.UNAUTHORIZED,
                CodeMessage.UNAUTHORIZED
            );
        }

        // if(user.isDeleted) {
        //     throw new ErrorException(
        //         HttpStatus.BAD_REQUEST,
        //         CodeMessage.USER_IS_DELETED
        //     )
        // }
        if (user.deleteAt) {
            throw new ErrorException(
                HttpStatus.BAD_REQUEST,
                CodeMessage.USER_IS_DELETED
            );
        }

        return user;

    }
}
