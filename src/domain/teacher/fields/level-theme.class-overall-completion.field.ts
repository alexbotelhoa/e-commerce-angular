import { GQLLevelThemeResolvers } from "../../../resolvers-types";
import { levelThemeTotalResourcesByLevelThemeIdLoader } from "../../../shared/resolvers/level-theme.resolvers";
import { classTotalStudentsByClassIdLoader } from "../dataloaders/class-total-students-by-class-id.loader";
import { levelThemeClassTotalCompletedActivitiesByLevelThemeIdLoader } from "../dataloaders/level-theme-class-total-completed-activities-by-level-theme-id.loader";

export const levelThemeClassOverallCompletionFieldResolver: GQLLevelThemeResolvers['classOverallCompletion'] = async (obj, params, context) => {
    const classId = parseInt(params.classId, 10);
    const [
        totalActivities,
        totalActivitiesCompleted,
        totalClassStudents
    ] = await Promise.all(
        [
            context.getDatabaseLoader(levelThemeTotalResourcesByLevelThemeIdLoader, undefined).load(obj.id),
            context.getDatabaseLoader(levelThemeClassTotalCompletedActivitiesByLevelThemeIdLoader, classId).load(obj.id),
            context.getDatabaseLoader(classTotalStudentsByClassIdLoader, undefined).load(classId)
        ]);

    const result = totalClassStudents > 0
        ? totalActivitiesCompleted / totalClassStudents
        : 0;
    // clamp to maximum value in case of database anomaly (e.g. old activities done by students not part of theme anymore)
    if (result > totalActivities) {
        return totalActivities;
    }
    return result;
}
