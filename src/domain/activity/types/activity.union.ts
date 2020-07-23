import { GQLResolvers } from "../../../resolvers-types";
import { ActivityTypeId } from "../enums/activity-type.enum";

export const activityUnionResolvers: GQLResolvers['ActivityUnion'] = {
    __resolveType: (obj) => {
        switch (obj.typeId) {
            case ActivityTypeId.EMBEDDED: {
                return 'EmbeddedActivity';
            }
            case ActivityTypeId.HTML: {
                return 'HtmlActivity';
            }
        }
        throw new Error(`Unmapped activity typeId ${obj.typeId}`);
    }
}
