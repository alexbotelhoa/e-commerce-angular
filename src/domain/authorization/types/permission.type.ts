import { PermissionId } from "../enums/permission-id.enum";

export interface Permission {
    id: PermissionId;
    name: string;
    description: string;
}

