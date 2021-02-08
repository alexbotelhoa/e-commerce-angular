export interface UserEntity {
    id: string;
    name: string;
    onboarded: boolean;
    avatarId: number | null;
    macId: string | null;
    macPass: string | null;
}

export const USER_TABLE = 'user';
