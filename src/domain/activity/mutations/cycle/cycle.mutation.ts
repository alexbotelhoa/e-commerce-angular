import { GQLMutationResolvers } from "../../../../resolvers-types";
import { getCycleById, insertCycle, updateCycle } from "../../../../shared/repositories/cycle.repository";

export const createCycleMutationResolver: GQLMutationResolvers['createCycle'] = async (obj, { data }, context) => {
    return getCycleById(context.database)(await insertCycle(context.database)(data));
}

export const activateCycleMutationResolver: GQLMutationResolvers['activateCycle'] = async (obj, { id }, context) => {
    return getCycleById(context.database)(await updateCycle(context.database)({ active: true })(builder => builder.andWhere('id', id)));
}

export const deactivateCycleMutationResolver: GQLMutationResolvers['deactivateCycle'] = async (obj, { id }, context) => {
    return getCycleById(context.database)(await updateCycle(context.database)({ active: false })(builder => builder.andWhere('id', id)));
}