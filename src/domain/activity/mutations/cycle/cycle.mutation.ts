import { GQLMutationResolvers } from "../../../../resolvers-types";
import { getCycleById, insertCycle, updateCycle } from "../../../../shared/repositories/cycle.repository";

export const createCycleMutationResolver: GQLMutationResolvers['createCycle'] = async (obj, { data }, context) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getCycleById(context.database)(await insertCycle(context.database)({
        ...data,
        levelThemeId: parseInt(data.levelThemeId, 10)
    })))!;
}

export const activateCycleMutationResolver: GQLMutationResolvers['activateCycle'] = async (obj, { id }, context) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getCycleById(context.database)(await updateCycle(context.database)({ active: true })(builder => builder.andWhere('id', id))))!;
}

export const deactivateCycleMutationResolver: GQLMutationResolvers['deactivateCycle'] = async (obj, { id }, context) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getCycleById(context.database)(await updateCycle(context.database)({ active: false })(builder => builder.andWhere('id', id))))!;
}
