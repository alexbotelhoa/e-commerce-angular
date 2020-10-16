import { GQLCycleResolvers } from "../../../../resolvers-types";
import { classTotalStudentsByClassIdLoader } from "../../dataloaders/class-total-students-by-class-id.loader";
import { cycleClassTotalCompletedActivitiesbyCycleIdLoader } from "../../dataloaders/cycle-class-total-completed-activities-by-cycle-id.loader";
import { cycleTotalActivitiesByCycleIdLoader } from "../../dataloaders/cycle-total-activities-by-cycle-id.loader";

export const cycleClassOverallCompletionRatioFieldResolver: GQLCycleResolvers['classOverallCompletionRatio'] = async (obj, params, context) => {
    const classId = parseInt(params.classId, 10);
    const [
        totalActivities,
        totalActivitiesCompleted,
        totalClassStudents
    ] = await Promise.all(
        [
            context.getDatabaseLoader(cycleTotalActivitiesByCycleIdLoader, undefined).load(obj.id),
            context.getDatabaseLoader(cycleClassTotalCompletedActivitiesbyCycleIdLoader, classId).load(obj.id),
            context.getDatabaseLoader(classTotalStudentsByClassIdLoader, undefined).load(classId)
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
