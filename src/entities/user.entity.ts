export interface UserEntity {
    id: number;
    name: string;
    onboarded: boolean;
    avatarId: number | null;
}

export const USER_TABLE = 'user';
