export interface ThemeEntity {
    id: number;
    name: string;
    active: boolean;
    startColor: string;
    endColor: string;
}

export const THEME_TABLE = 'theme';
