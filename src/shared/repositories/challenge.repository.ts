import { createRepository } from "../services/repository.service";
import { ChallengeEntity, CHALLENGE_TABLE } from "../../entities/challenge.entity";

export const {
    getById: getChallengeById,
    getManyByIds: getChallengesByIds,
    select: selectChallenge,
    insert: insertChallenge,
    update: updateChallenge,
    delete: deleteChallenge,
    deleteAll: deleteAllChallenges,
    count: countChallenges,
} = createRepository<ChallengeEntity>(CHALLENGE_TABLE, 'id');
