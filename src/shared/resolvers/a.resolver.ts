import { GQLEventRegistrationResponseSuccessResolvers } from "../../resolvers-types";



export const registerEventResultResolver: GQLEventRegistrationResponseSuccessResolvers = {
    message: (obj) => obj.message,
    success: (obj) => obj.success,
}
