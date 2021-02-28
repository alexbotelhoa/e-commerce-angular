export interface ChallengeEntity {
    id: number;
    text: string;
    startAt: string | Date;
    endAt: string | Date;
}

export const CHALLENGE_TABLE = 'challenge';
