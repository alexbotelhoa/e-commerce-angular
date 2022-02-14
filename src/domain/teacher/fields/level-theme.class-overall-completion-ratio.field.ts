import { GQLLevelThemeResolvers } from "../../../resolvers-types";
import { levelThemeTotalResourcesByLevelThemeIdLoader } from "../../../shared/resolvers/level-theme.resolver";
import { classTotalStudentsByClassIdLoader } from "../dataloaders/class-total-students-by-class-id.loader";
import { levelThemeClassTotalCompletedActivitiesByLevelThemeIdLoader } from "../dataloaders/level-theme-class-total-completed-activities-by-level-theme-id.loader";

export const levelThemeClassOverallCompletionRatioFieldResolver: GQLLevelThemeResolvers['classOverallCompletion'] = async (obj, params, context) => {
    // const classId = parseInt(params.classId, 10);
    const [
        totalActivities,
        totalActivitiesCompleted,
        totalClassStudents
    ] = await Promise.all(
        [
            context.getDatabaseLoader(levelThemeTotalResourcesByLevelThemeIdLoader, undefined).load(obj.id),
            context.getDatabaseLoader(levelThemeClassTotalCompletedActivitiesByLevelThemeIdLoader, params.classId).load(obj.id),
            context.getDatabaseLoader(classTotalStudentsByClassIdLoader, undefined).load(params.classId)
        ]);
    let result: number;
    if (totalClassStudents === 0 || totalActivities === 0) {
        result = 0
    } else {
        result = totalActivitiesCompleted / totalClassStudents / totalActivities;
    }
    // clamp to max value in case of some database anomaly
    if (result > 1) {
        return 1;
    }
    return result;
}
