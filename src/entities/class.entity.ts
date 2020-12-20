export interface ClassEntity {
    id: string;
    name: string;
    levelCodeId: number;
    institutionId: string | null;
    periodId: string | null;
    carrerId: string | null;
    sessionId: string | null;
    campusId: string | null;
    localId: string | null;
    regionalId: string | null;
    startDate: string | Date | null;
    endDate: string | Date | null;
}

export const CLASS_TABLE = 'class';
