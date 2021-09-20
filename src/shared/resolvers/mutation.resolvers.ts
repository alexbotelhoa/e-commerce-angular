import { GQLResolvers, GQLMutationResolvers } from "../../resolvers-types"

import {
    toggleThemeState,
    createThemeMutationResolver,
    updateThemeMutationResolver
} from "../../domain/activity/mutations/theme/theme.mutation";

import {
    toggleCycleState,
    createCycleMutationResolver,
    addActivitiesToCycleMutationResolver,
    deleteActivityFromCycleMutation,
    deleteCycleFromLevelThemeMutation,
    updateCycleMutationResolver
} from "../../domain/activity/mutations/cycle/cycle.mutation";

import {
    toggleActivityState, createEmbeddedActivityMutationResolver, createHtmlActivityMutationResolver,
} from "../../domain/activity/mutations/activity/activity.mutation"

import {
    toggleLevelState,
    addThemesToLevelMutationResolver,
    deleteThemeFromLevelMutation
} from "../../domain/activity/mutations/level/level.mutation"
import { createLevelCodeMutation } from "../../domain/activity/mutations/level/create-level-code.mutation";
import { createLevelMutationResolver } from "../../domain/activity/mutations/level/create-level.mutation";
import { updateBasicLevelInfoMutationResolver } from "../../domain/activity/mutations/level/update-basic-level-info.mutation";
import { updateEmbeddedActivityMutationResolver } from "../../domain/activity/mutations/activity/update-embedded-activity.mutation";
import { updateLevelThemesOrderMutation } from "../../domain/activity/mutations/level-theme/update-level-themes-order.mutation";
import { updateCyclesOrderMutation } from "../../domain/activity/mutations/cycle/update-cycles-order.mutation";
import { updateCycleActivitiesOrderMutation } from "../../domain/activity/mutations/cycle-activity/update-cycle-activities-order.mutation";
import { createCommentOnActivityMutationResolver } from "../../domain/activity/mutations/create-comment-on-activity/create-comment-on-activity.mutation";
import { deleteActivityCommentMutationResolver } from "../../domain/activity/mutations/delete-activity-comment/delete-activity-comment.mutation";
import { startActivityMutationResolver } from "../../domain/activity/mutations/start-activity/start-activity.mutation";
import { completeActivityMutationResolver } from "../../domain/activity/mutations/complete-activity/complete-activity.mutation";
import { viewerChangeAvatarMutationResolver } from "../../domain/avatar/mutations/viewer-change-avatar/viewer-change-avatar.mutation";
import { finishOnboardMutationResolver } from "../../domain/activity/mutations/finish-onboard/finish-onboard.mutation";
import { upsertOrRemoteUserInterestMutationResolver } from "../../domain/activity/mutations/user-interest/upsert-or-remove-user-interest.mutation";
import { createChallengeMutationResolver, toggleChallengeState, updateChallengeMutationResolver } from "../../domain/activity/mutations/challenge/challenge.mutation";
import { createNewsletterMutationResolver, toggleNewsletterState, updateNewsletterMutationResolver } from "../../domain/activity/mutations/newsletter/newsletter.mutation";
import { upsertAnnotationResolver } from "../../domain/annotation/mutations/upsert-annotation.resolver";
import { auditResolver } from "../../domain/log/mutation/call-audit.mutation.resolver";
import { presenceResolver } from "../../domain/presence/presence.mutation.resolver";

const cycleEntityResolvers: Pick<GQLMutationResolvers, 'createCycle' | 'activateCycle' | 'deactivateCycle' | 'addActivitiesToCycle' | 'deleteActivityFromCycle'> = {
    createCycle: createCycleMutationResolver,
    addActivitiesToCycle: addActivitiesToCycleMutationResolver,
    activateCycle: toggleCycleState({ active: true }),
    deactivateCycle: toggleCycleState({ active: false }),
    deleteActivityFromCycle: deleteActivityFromCycleMutation,
}

const themeEntityResolvers: Pick<GQLMutationResolvers, 'createTheme' | 'updateTheme' | 'activateTheme' | 'deactivateTheme'> = {
    createTheme: createThemeMutationResolver,
    updateTheme: updateThemeMutationResolver,
    activateTheme: toggleThemeState({ active: true }),
    deactivateTheme: toggleThemeState({ active: false }),
}

const activityEntityResolvers: Pick<GQLMutationResolvers, 'activateActivity' | 'deactivateActivity' | 'createEmbeddedActivity' | 'createHtmlActivity'> = {
    activateActivity: toggleActivityState({ active: true }),
    deactivateActivity: toggleActivityState({ active: false }),
    createEmbeddedActivity: createEmbeddedActivityMutationResolver,
    createHtmlActivity: createHtmlActivityMutationResolver,
}

const levelEntityResolvers: Pick<GQLMutationResolvers, 'addThemesToLevel' | 'activateLevel' | 'deactivateLevel' | 'deleteThemeFromLevel'> = {
    addThemesToLevel: addThemesToLevelMutationResolver,
    activateLevel: toggleLevelState({ active: true }),
    deactivateLevel: toggleLevelState({ active: false }),
    deleteThemeFromLevel: deleteThemeFromLevelMutation,
}

const challengeEntityResolvers: Pick<GQLMutationResolvers, 'createChallenge' | 'updateChallenge' | 'deactivateChallenge' | 'activateChallenge'> = {
    createChallenge: createChallengeMutationResolver,
    updateChallenge: updateChallengeMutationResolver,
    activateChallenge: toggleChallengeState({ active: true }),
    deactivateChallenge: toggleChallengeState({ active: false }),
}

const newsletterEntityResolvers: Pick<GQLMutationResolvers, 'createNewsletter' | 'updateNewsletter' | 'deactivateNewsletter' | 'activateNewsletter'> = {
    createNewsletter: createNewsletterMutationResolver,
    updateNewsletter: updateNewsletterMutationResolver,
    activateNewsletter: toggleNewsletterState({ active: true }),
    deactivateNewsletter: toggleNewsletterState({ active: false }),
}

export const mutationResolvers: GQLResolvers['Mutation'] = {
    ...cycleEntityResolvers,
    ...themeEntityResolvers,
    ...activityEntityResolvers,
    ...levelEntityResolvers,
    ...challengeEntityResolvers,
    ...newsletterEntityResolvers,
    createLevelCode: createLevelCodeMutation,
    createLevel: createLevelMutationResolver,
    updateBasicLevelInfo: updateBasicLevelInfoMutationResolver,
    updateEmbeddedActivity: updateEmbeddedActivityMutationResolver,
    deleteCycleFromLevelTheme: deleteCycleFromLevelThemeMutation,
    updateLevelThemesOrder: updateLevelThemesOrderMutation,
    updateCyclesOrder: updateCyclesOrderMutation,
    updateCycleActivitiesOrder: updateCycleActivitiesOrderMutation,
    updateCycle: updateCycleMutationResolver,
    createCommentOnActivity: createCommentOnActivityMutationResolver,
    deleteActivityComment: deleteActivityCommentMutationResolver,
    startActivity: startActivityMutationResolver,
    completeActivity: completeActivityMutationResolver,
    viewerChangeAvatar: viewerChangeAvatarMutationResolver,
    finishOnboard: finishOnboardMutationResolver,
    upsertOrRemoveUserInterest: upsertOrRemoteUserInterestMutationResolver,
    // registerEventMutation: RegisterEventMutationResolver,
    // cancelRegisterEventMutation: cancelRegisterEventMutationResolver,
    upsertAnnotation: upsertAnnotationResolver,
    audit: auditResolver,
    presence: presenceResolver,
}
