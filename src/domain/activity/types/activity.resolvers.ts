import { GQLHtmlActivityResolvers } from "../../../resolvers-types";
import { ActivityEntity } from "../../../entities/activity.entity";
import { getActivityTypeById } from "../repositories/activity-type.repository";

/**
 * Implements the base resolvers for an entity that implements the Activity interface
 */
export const activityResolvers: Pick<Required<GQLHtmlActivityResolvers>, keyof ActivityEntity | 'type'> =
{
    id: obj => obj.id.toString(),
    name: obj => obj.name,
    description: obj => obj.description,
    typeId: obj => obj.typeId,
    type: obj => getActivityTypeById(obj.typeId),
    active: obj => obj.active
}
