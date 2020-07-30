import { GQLResolvers, GQLMutationResolvers } from "../../resolvers-types"

import {
    toggleThemeState,
    createThemeMutationResolver
} from "../../domain/activity/mutations/theme/theme.mutation";

import {
    toggleCycleState,
    createCycleMutationResolver
} from "../../domain/activity/mutations/cycle/cycle.mutation";

import {
    toggleActivityState,
    createActivityMutationResolver
} from "../../domain/activity/mutations/activity/activity.mutation"

const cycleEntityResolvers: Pick<GQLMutationResolvers, 'createCycle' | 'activateCycle' | 'deactivateCycle'> = {
    createCycle: createCycleMutationResolver,
    activateCycle: toggleCycleState({ active: true }),
    deactivateCycle: toggleCycleState({ active: false })
}

const themeEntityResolvers: Pick<GQLMutationResolvers, 'createTheme' | 'activateTheme' | 'deactivateTheme'> = {
    createTheme: createThemeMutationResolver,
    activateTheme: toggleThemeState({ active: true }),
    deactivateTheme: toggleThemeState({ active: false }),
}

const activityEntityResolvers: Pick<GQLMutationResolvers, 'createActivity' | 'activateActivity' | 'deactivateActivity'> = {
    activateActivity: toggleActivityState({ active: true }),
    deactivateActivity: toggleActivityState({ active: false }),
    createActivity: createActivityMutationResolver
}

export const mutationResolvers: GQLResolvers['Mutation'] = {
    ...cycleEntityResolvers,
    ...themeEntityResolvers,
    ...activityEntityResolvers
}