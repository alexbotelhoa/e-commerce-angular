import { GQLQueryResolvers } from "../../resolvers-types";
import { getMeetingById } from "../../shared/repositories/meeting.repository";

export const getMeetQueryResolver: GQLQueryResolvers['meet'] = async (obj, params, context) => {
    return await getMeetingById(context.database)(params.id) as any;
}