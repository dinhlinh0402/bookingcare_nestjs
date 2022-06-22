import { CanActivate, ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CodeMessage } from "src/common/constants/code-message";
import { ErrorException } from "src/exceptions/error.exception";
import { UserEntity } from "src/modules/user/user.entity";
import { checkPermissions } from "src/utils/checkPermission.util";

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private reflector: Reflector,// public readonly permissionActiveRepo: PermissionActiveRepository,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const permissions = this.reflector.get<string[]>(
            'permissions',
            context.getHandler(),
        );

        if (!permissions) {
            return true;
        }
        // console.log(permissions);


        const request = context.switchToHttp().getRequest();
        const user: UserEntity = await request.user;
        // console.log('usser: ', user);

        const check = await checkPermissions(user, permissions);
        // console.log("check from permission.guard: ", check);

        if (!check) {
            throw new ErrorException(
                HttpStatus.FORBIDDEN,
                CodeMessage.FORBIDDEN
            )
        }

        return true
    }
}