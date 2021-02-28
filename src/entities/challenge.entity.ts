export interface ChallengeEntity {
    id: number;
    text: string;
    startAt: string | Date;
    endAt: string | Date;
    active: boolean;
}

export const CHALLENGE_TABLE = 'challenge';
