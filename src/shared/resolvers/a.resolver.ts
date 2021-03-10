import { GQLCancelEventRegistrationResponseSuccessResolvers, GQLEventRegistrationResponseSuccessResolvers } from "../../resolvers-types";



export const registerEventResultResolver: GQLEventRegistrationResponseSuccessResolvers = {
    message: (obj) => obj.message,
    success: (obj) => obj.success,
}


export const cancelRegisterEventResultResolver: GQLCancelEventRegistrationResponseSuccessResolvers = {
    message: (obj) => obj.message,
    success: (obj) => obj.success,
}
