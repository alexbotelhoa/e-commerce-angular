import { UserEntity } from "../../entities/user.entity";
import { PermissionMap } from "../../domain/authorization/types/permission-map.type";

export interface CurrentUser {
    entity: UserEntity;
    sessionId: string;
    permissionMap: PermissionMap;
}
