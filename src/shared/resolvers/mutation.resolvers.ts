import { GQLResolvers, GQLMutationResolvers } from "../../resolvers-types"

import {
    createThemeMutationResolver,
    activateThemeMutationResolver,
    deactivateThemeMutationResolver
} from "../../domain/activity/mutations/theme/theme.mutation";

import {
    createCycleMutationResolver,
    activateCycleMutationResolver,
    deactivateCycleMutationResolver
} from "../../domain/activity/mutations/cycle/cycle.mutation";

const cycleEntityResolvers: Pick<GQLMutationResolvers, 'createCycle' | 'activateCycle' | 'deactivateCycle'> = {
    createCycle: createCycleMutationResolver,
    activateCycle: activateCycleMutationResolver,
    deactivateCycle: deactivateCycleMutationResolver
}

const themeEntityResolvers: Pick<GQLMutationResolvers, 'createTheme' | 'activateTheme' | 'deactivateTheme'> = {
    createTheme: createThemeMutationResolver,
    activateTheme: activateThemeMutationResolver,
    deactivateTheme: deactivateThemeMutationResolver,
}

export const mutationResolvers: GQLResolvers['Mutation'] = {
    ...cycleEntityResolvers,
    ...themeEntityResolvers
}