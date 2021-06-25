export interface PermissionEntity {
    id: string;
    carrerId: string;
    carrerName: string;
    name: boolean;
    createdAt: string;
    updatedAt: string;
    active: boolean;
}

export const PERMISSION_TABLE = 'permission';
