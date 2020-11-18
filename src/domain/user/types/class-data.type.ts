import { LevelData } from "./level-data.type";

export interface ClassData {
    id: string;
    name: string;
    institutionId: string;
    periodId: string;
    sessionId: string;
    carrerId: string;
    startDate: string;
    endDate: string;
    level: LevelData;
}
