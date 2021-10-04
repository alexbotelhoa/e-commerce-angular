import { GQLQueryResolvers } from "../../../resolvers-types";
import { callOccLogin } from "../../user/services/call-occ.service";

export const callOccLoginQueryResolver: GQLQueryResolvers['occLogin'] = async (obj, params, context) => {
        const user = context.currentUser;
        const userId = user?.id;
        if (!userId) throw new Error("user not found")
        return (await callOccLogin(userId, context.logger)).data;
}
