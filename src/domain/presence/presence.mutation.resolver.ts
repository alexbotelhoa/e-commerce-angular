import { GQLMutationResolvers } from "../../resolvers-types";
import { callPresenceService } from "../user/services/presence.service";


export const presenceResolver: GQLMutationResolvers['presence'] = async (obj, params, context) => {
    const userId = context.currentUser?.id;
    if (!userId) throw new Error("user not found")
    return callPresenceService({
        turma: params.turma,
        userId: userId,
    }, context.database, context.logger)


}