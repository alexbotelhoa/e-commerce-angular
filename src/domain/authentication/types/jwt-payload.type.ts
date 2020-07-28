import { RoleId } from "../../authorization/enums/role-id.enum";

export interface JWTPayload {
    userId: number;
    roles: RoleId[];
}
