export interface PermissionEntity {
    id: string;
    carrerId: string;
    carrer: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    active: boolean;
}

export const PERMISSION_TABLE = 'permission';
