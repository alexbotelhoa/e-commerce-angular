export interface ClassEntity {
    id: number;
    name: string;
    levelCodeId: number;
    institutionId: string | null;
    periodId: string | null;
    carrerId: string | null;
    sessionId: string | null;
    startDate: string | Date | null;
    endDate: string | Date | null;
}

export const CLASS_TABLE = 'class';
