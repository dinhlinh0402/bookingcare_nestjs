import { RoleEnum } from "src/common/constants/role";
import { UserEntity } from "src/modules/user/user.entity";
import { getConnection } from "typeorm";

export const checkPermissions = async (
    user: UserEntity,
    code: string[],
): Promise<boolean> => {
    if (user.role == RoleEnum.ADMIN) {
        return true;
    }
    // console.log('role: ', user.role);

    // code.forEach((elm) => {
    //     if (elm == user.role) {
    //         return true;
    //     }
    // })
    const check = await getConnection()
        .getRepository(UserEntity)
        .createQueryBuilder('user')
        .where('user.id = :userId', {
            userId: user.id
        })
        .andWhere(
            'user.role in (:permissions)', {
            permissions: code
        }
        )
        .getOne()

    // console.log('check: ', check);

    if (check) return true;


    return false;
}