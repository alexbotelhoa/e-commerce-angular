export interface ChallengeEntity {
    id: number;
    text: string;
    startAt: string | Date;
}

export const CHALLENGE_TABLE = 'challenge';
