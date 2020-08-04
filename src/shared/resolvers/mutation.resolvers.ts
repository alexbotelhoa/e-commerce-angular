import { GQLResolvers, GQLMutationResolvers } from "../../resolvers-types"

import {
    toggleThemeState,
    createThemeMutationResolver
} from "../../domain/activity/mutations/theme/theme.mutation";

import {
    toggleCycleState,
    createCycleMutationResolver,
    addActivitiesToCycleMutationResolver
} from "../../domain/activity/mutations/cycle/cycle.mutation";

import {
    toggleActivityState,
    createActivityMutationResolver
} from "../../domain/activity/mutations/activity/activity.mutation"

import {
    toggleLevelState,
    addThemesToLevelMutationResolver
} from "../../domain/activity/mutations/level/level.mutation"
import { createLevelCodeMutation } from "../../domain/activity/mutations/level/create-level-code.mutation";
import { createLevelMutationResolver } from "../../domain/activity/mutations/level/create-level.mutation";
import { updateBasicLevelInfoMutationResolver } from "../../domain/activity/mutations/level/update-basic-level-info.mutation";
import { updateEmbeddedActivityMutationResolver } from "../../domain/activity/mutations/activity/update-embedded-activity.mutation";

const cycleEntityResolvers: Pick<GQLMutationResolvers, 'createCycle' | 'activateCycle' | 'deactivateCycle' | 'addActivitiesToCycle'> = {
    createCycle: createCycleMutationResolver,
    addActivitiesToCycle: addActivitiesToCycleMutationResolver,
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

const levelEntityResolvers: Pick<GQLMutationResolvers, 'addThemesToLevel' | 'activateLevel' | 'deactivateLevel'> = {
    addThemesToLevel: addThemesToLevelMutationResolver,
    activateLevel: toggleLevelState({ active: true }),
    deactivateLevel: toggleLevelState({ active: false })
}

export const mutationResolvers: GQLResolvers['Mutation'] = {
    ...cycleEntityResolvers,
    ...themeEntityResolvers,
    ...activityEntityResolvers,
    ...levelEntityResolvers,
    createLevelCode: createLevelCodeMutation,
    createLevel: createLevelMutationResolver,
    updateBasicLevelInfo: updateBasicLevelInfoMutationResolver,
    updateEmbeddedActivity: updateEmbeddedActivityMutationResolver,
}
