import { GQLLevelThemeResolvers } from "../../../resolvers-types";
import { levelThemeTotalResourcesByLevelThemeIdLoader } from "../../../shared/resolvers/level-theme.resolvers";
import { classTotalStudentsByClassIdLoader } from "../dataloaders/class-total-students-by-class-id.loader";
import { levelThemeClassTotalCompletedActivitiesByLevelThemeIdLoader } from "../dataloaders/level-theme-class-total-completed-activities-by-level-theme-id.loader";

export const levelThemeClassOverallCompletionRatioFieldResolver: GQLLevelThemeResolvers['classOverallCompletion'] = async (obj, params, context) => {
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

    const result = totalActivitiesCompleted / totalClassStudents / totalActivities;
    // clamp to max value in case of some database anomaly
    if (result > 1) {
        return 1;
    }
    return result;
}