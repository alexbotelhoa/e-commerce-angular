export interface ClassEntity {
    id: number;
    name: string;
    levelCodeId: number;
    institutionId: string | null;
    periodId: string | null;
    carrerId: string | null;
    sessionId: string | null;
}

export const CLASS_TABLE = 'class';
