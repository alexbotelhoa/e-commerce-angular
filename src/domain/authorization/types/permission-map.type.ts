import { PermissionId } from "../enums/permission-id.enum";

export type PermissionMap = Readonly<Partial<Record<PermissionId, true>>>;
