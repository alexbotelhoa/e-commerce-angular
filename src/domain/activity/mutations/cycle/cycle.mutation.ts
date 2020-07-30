import { GQLMutationResolvers } from "../../../../resolvers-types";
import { getCycleById, insertCycle, updateCycle } from "../../../../shared/repositories/cycle.repository";

export const createCycleMutationResolver: GQLMutationResolvers['createCycle'] = async (obj, { data: { name, levelThemeId, active } }, context) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await getCycleById(context.database)(await insertCycle(context.database)({
        name,
        levelThemeId: parseInt(levelThemeId, 10),
        active: active || undefined
    })))!;
}

export const toggleCycleState: (data: Record<'active', boolean>) => GQLMutationResolvers['activateCycle'] | GQLMutationResolvers['deactivateCycle'] =
    (data: Record<'active', boolean>) =>
        async (obj, { id }, { database: db }) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return (await getCycleById(db)(await updateCycle(db)(data)(builder => builder.andWhere('id', id))))!;
        }