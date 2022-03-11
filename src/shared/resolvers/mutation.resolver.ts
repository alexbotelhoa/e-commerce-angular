import { GQLResolvers, GQLMutationResolvers } from "../../resolvers-types";

import {
    toggleCycleState,
    createCycleMutationResolver,
    updateCycleMutationResolver,
    deleteActivityFromCycleMutation,
    deleteCycleFromLevelThemeMutation,
    addActivitiesToCycleMutationResolver,
} from "../../domain/activity/mutations/cycle/cycle.mutation";

import { presenceResolver } from "../../domain/presence/presence.mutation";
import { messageResolver } from "../../domain/chat/mutations/chat.mutation";
import { auditResolver } from "../../domain/log/mutations/call-audit.mutation.resolver";
import { chatMakeReadResolver } from "../../domain/chat/mutations/chat-make-read.mutation";
import { finishOnboardMutationResolver } from "../../domain/finish-onboard/finish-onboard.mutation";
import { upsertAnnotationResolver } from "../../domain/annotation/mutations/upsert-annotation.mutation";
import { createLevelMutationResolver } from "../../domain/activity/mutations/level/create-level.mutation";
import { createLevelCodeMutation } from "../../domain/activity/mutations/level/create-level-code.mutation";
import { updateCyclesOrderMutation } from "../../domain/activity/mutations/cycle/update-cycles-order.mutation";
import { viewerChangeAvatarMutationResolver } from "../../domain/avatar/mutations/viewer-change-avatar.mutation";
import { startActivityMutationResolver } from "../../domain/activity/mutations/start-activity/start-activity.mutation";
import { updateBasicLevelInfoMutationResolver } from "../../domain/activity/mutations/level/update-basic-level-info.mutation";
import { updateLevelThemesOrderMutation } from "../../domain/activity/mutations/level-theme/update-level-themes-order.mutation";
import { completeActivityMutationResolver } from "../../domain/activity/mutations/complete-activity/complete-activity.mutation";
import { updateEmbeddedActivityMutationResolver } from "../../domain/activity/mutations/activity/update-embedded-activity.mutation";
import { upsertOrRemoteUserInterestMutationResolver } from "../../domain/interest/mutations/upsert-or-remove-user-interest.mutation";
import { updateCycleActivitiesOrderMutation } from "../../domain/activity/mutations/cycle-activity/update-cycle-activities-order.mutation";
import { deleteActivityCommentMutationResolver } from "../../domain/activity/mutations/delete-activity-comment/delete-activity-comment.mutation";
import { toggleThemeState, createThemeMutationResolver, updateThemeMutationResolver } from "../../domain/activity/mutations/theme/theme.mutation";
import { toggleLevelState, addThemesToLevelMutationResolver, deleteThemeFromLevelMutation } from "../../domain/activity/mutations/level/level.mutation";
import { createCommentOnActivityMutationResolver } from "../../domain/activity/mutations/create-comment-on-activity/create-comment-on-activity.mutation";
import { createChallengeMutationResolver, toggleChallengeState, updateChallengeMutationResolver } from "../../domain/challenge/mutations/challenge.mutation";
import { createNewsletterMutationResolver, toggleNewsletterState, updateNewsletterMutationResolver } from "../../domain/newsletter/mutations/newsletter.mutation";
import { toggleActivityState, createEmbeddedActivityMutationResolver, createHtmlActivityMutationResolver } from "../../domain/activity/mutations/activity/activity.mutation";
import { updateUserRolesMutationResolver } from "../../domain/user-role/mutations/update-user-roles.mutation";

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
    ...levelEntityResolvers,
    ...activityEntityResolvers,
    ...challengeEntityResolvers,
    ...newsletterEntityResolvers,
    audit: auditResolver,
    presence: presenceResolver,
    insertChat: messageResolver,
    chatMakeRead: chatMakeReadResolver,
    createLevel: createLevelMutationResolver,
    updateCycle: updateCycleMutationResolver,
    createLevelCode: createLevelCodeMutation,
    upsertAnnotation: upsertAnnotationResolver,
    finishOnboard: finishOnboardMutationResolver,
    startActivity: startActivityMutationResolver,
    updateCyclesOrder: updateCyclesOrderMutation,
    updateUserRoles: updateUserRolesMutationResolver,
    completeActivity: completeActivityMutationResolver,
    viewerChangeAvatar: viewerChangeAvatarMutationResolver,
    updateLevelThemesOrder: updateLevelThemesOrderMutation,
    updateBasicLevelInfo: updateBasicLevelInfoMutationResolver,
    deleteActivityComment: deleteActivityCommentMutationResolver,
    deleteCycleFromLevelTheme: deleteCycleFromLevelThemeMutation,
    updateEmbeddedActivity: updateEmbeddedActivityMutationResolver,
    updateCycleActivitiesOrder: updateCycleActivitiesOrderMutation,
    createCommentOnActivity: createCommentOnActivityMutationResolver,
    upsertOrRemoveUserInterest: upsertOrRemoteUserInterestMutationResolver,
}
