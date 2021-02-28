import { GQLMutationResolvers } from "../../../../resolvers-types";
import { getChallengeById, insertChallenge, updateChallenge } from "../../../../shared/repositories/challenge.repository";

export const createChallengeMutationResolver: GQLMutationResolvers['createChallenge'] = async (obj, { data }, { database: db }) => {
    const { text, startAt, endAt } = data;
    const insertedId = await db.transaction(async trx => {
        const id = await insertChallenge(trx)({ text, startAt, endAt });
        return id;
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getChallengeById(db)(insertedId))!;
}

export const updateChallengeMutationResolver: GQLMutationResolvers['updateChallenge'] = async (obj, { data }, context) => {
    const theme = await getChallengeById(context.database);
    if (!theme) {
        throw new Error(`Challenge with id ${data.id} was not found.`);
    }

    await context.database.transaction(async trx => {
        await updateChallenge(trx)({
            text: data.text,
            startAt: data.startAt,
            endAt: data.endAt,
        })(builder => builder.andWhere('id', data.id));
    })

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getChallengeById(context.database)(data.id))!;
}