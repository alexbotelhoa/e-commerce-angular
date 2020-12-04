import { GQLCycleResolvers } from "../../../../resolvers-types";
import { classTotalStudentsByClassIdLoader } from "../../dataloaders/class-total-students-by-class-id.loader";
import { cycleClassTotalCompletedActivitiesbyCycleIdLoader } from "../../dataloaders/cycle-class-total-completed-activities-by-cycle-id.loader";
import { cycleTotalActivitiesByCycleIdLoader } from "../../dataloaders/cycle-total-activities-by-cycle-id.loader";

export const cycleClassOverallCompletionFieldResolver: GQLCycleResolvers['classOverallCompletion'] = async (obj, params, context) => {
    // const classId = parseInt(params.classId, 10);
    const [
        totalActivities,
        totalActivitiesCompleted,
        totalClassStudents
    ] = await Promise.all(
        [
            context.getDatabaseLoader(cycleTotalActivitiesByCycleIdLoader, undefined).load(obj.id),
            context.getDatabaseLoader(cycleClassTotalCompletedActivitiesbyCycleIdLoader, params.classId).load(obj.id),
            context.getDatabaseLoader(classTotalStudentsByClassIdLoader, undefined).load(params.classId)
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
