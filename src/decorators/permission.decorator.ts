import { SetMetadata } from "@nestjs/common";

export const Permissions = (...permissions: string[]) => SetMetadata('permissions', permissions);

// permissions format: code:actionKey
export const PermissionProcess = (permissions: string) =>
    SetMetadata('permissionProcess', permissions);