export interface UserEntity {
    id: string;
    name: string;
    onboarded: boolean;
    avatarId: number | null;
}

export const USER_TABLE = 'user';
