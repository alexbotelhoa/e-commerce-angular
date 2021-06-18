// import { GQLMutationResolvers } from "../../../../resolvers-types";
// import { environmentFactory } from "../../../../shared/services/environment.service";
// import axios from 'axios';

// export const RegisterEventMutationResolver: GQLMutationResolvers['registerEventMutation'] =
//     async (obj, { data }, context) => {
//         const user = context.currentUser;
//         if (!user) {
//             const simpleError = {
//                 message: `You are not authenticated.`,
//                 success: false,
//             }
//             return simpleError;
//         }
//         const env = environmentFactory()
//         const url = `${env.STUDENT_GRADE_INTEGRATION_URL.replace("lxp", "dadosacademicos")}/${user.id}/eventos/matriculas`
//         console.log(url)
//         try {
//             const integrationRequest = await axios.post<{
//                 Result: string;
//             }>(url, {
//                 "turma": data.classId
//             }, {
//                 headers: {
//                     'apikey': env.STUDENT_GRADE_INTEGRATION_API_KEY,
//                 },
//                 responseType: 'json',
//             });
//             if (context.redisClient) {
//                 await context.redisClient.del("event-" + user.id)
//             }
//             return {
//                 message: integrationRequest.data.Result,
//                 success: true,
//             }
//         } catch (err) {
//             const simpleError = {
//                 message: err.response.data.error,
//                 success: false,
//             }
//             return simpleError
//         }
//     };